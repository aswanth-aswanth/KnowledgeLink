import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {
  setRectangles,
  setConnections,
  setSelectedRect,
  setCurrentLineStyle,
  setIsConnectingMode,
  setIsMultiSelectMode,
  setCirclesVisible,
  setScale,
  updateRectPosition,
  updateRectSize,
  deleteRect,
  addConnection,
} from '@/store/editorSlice';

export const useEditor = () => {
  const dispatch = useDispatch();
  const editorState = useSelector((state: RootState) => state.editor);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<string | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) {
      const svgRect = e.currentTarget.getBoundingClientRect();
      setDragStart({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      });
      setIsDragging(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging && (editorState.selectedRect || editorState.selectedRects?.length > 0)) {
        const svgRect = e.currentTarget.getBoundingClientRect();
        const dx = e.clientX - svgRect.left - dragStart.x;
        const dy = e.clientY - svgRect.top - dragStart.y;

        editorState.rectangles.forEach((rect) => {
          if (
            (editorState.isMultiSelectMode && editorState.selectedRects?.includes(rect.id)) ||
            (!editorState.isMultiSelectMode && rect.id === editorState.selectedRect)
          ) {
            dispatch(updateRectPosition({ id: rect.id, x: rect.x + dx, y: rect.y + dy }));
          }
        });

        setDragStart({
          x: e.clientX - svgRect.left,
          y: e.clientY - svgRect.top,
        });
      }
    },
    [isDragging, editorState.selectedRect, editorState.selectedRects, editorState.isMultiSelectMode, editorState.rectangles, dispatch, dragStart]
  );

  const handleMouseUp = () => setIsDragging(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        if (editorState.selectedRects?.length === editorState.rectangles.length) {
          dispatch(setSelectedRect(null));
        } else {
          dispatch(setSelectedRect(editorState.rectangles.map((rect) => rect.id)));
        }
      }
    },
    [editorState.rectangles, editorState.selectedRects, dispatch]
  );

  const handleCreateConnection = useCallback(() => {
    if (connectionStart && editorState.selectedRect && connectionStart !== editorState.selectedRect) {
      const newConnection = {
        from: connectionStart,
        to: editorState.selectedRect,
        style: editorState.currentLineStyle,
      };
      dispatch(addConnection(newConnection));
      setConnectionStart(null);
      dispatch(setSelectedRect(null));
    }
  }, [connectionStart, editorState.selectedRect, editorState.currentLineStyle, dispatch]);

  const handleStartConnecting = useCallback(() => {
    dispatch(setIsConnectingMode(!editorState.isConnectingMode));
    dispatch(setSelectedRect(null));
    setConnectionStart(null);
  }, [editorState.isConnectingMode, dispatch]);

  const handleRectInteraction = useCallback((id: string, event: React.MouseEvent) => {
    if (editorState.isConnectingMode) {
      if (!connectionStart) {
        setConnectionStart(id);
      } else if (connectionStart !== id) {
        const newConnection = {
          from: connectionStart,
          to: id,
          style: editorState.currentLineStyle,
        };
        dispatch(addConnection(newConnection));
        setConnectionStart(null);
      }
    } else if (editorState.isMultiSelectMode) {
      dispatch(setSelectedRect(
        editorState.selectedRects?.includes(id)
          ? editorState.selectedRects.filter((rectId) => rectId !== id)
          : [...(editorState.selectedRects || []), id]
      ));
    } else {
      dispatch(setSelectedRect(editorState.selectedRect === id ? null : id));
    }
  }, [editorState.isConnectingMode, editorState.isMultiSelectMode, editorState.selectedRect, editorState.selectedRects, editorState.currentLineStyle, connectionStart, dispatch]);

  const handleScaleUp = useCallback(() => {
    dispatch(setScale(Math.min(editorState.scale + 0.1, 2)));
  }, [editorState.scale, dispatch]);

  const handleScaleDown = useCallback(() => {
    dispatch(setScale(Math.max(editorState.scale - 0.1, 0.5)));
  }, [editorState.scale, dispatch]);

  const updateSvgHeight = useCallback(() => {
    const maxY = Math.max(...editorState.rectangles.map((rect) => rect.y + rect.height));
    return Math.max(600, maxY + 100);
  }, [editorState.rectangles]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleCreateConnection,
    handleStartConnecting,
    handleRectInteraction,
    handleScaleUp,
    handleScaleDown,
    updateSvgHeight,
  };
};