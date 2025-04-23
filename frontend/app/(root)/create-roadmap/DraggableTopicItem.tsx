import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux';
import {
  updateTopic,
  deleteTopic,
  addTopic,
  toggleExpand,
} from '@/redux/topicsSlice';
import { Draggable } from 'react-beautiful-dnd';
import { TopicNodeProps } from '@/types/roadmap';
import TopicContentEditor from './TopicContentEditor';
import TopicHeader from './TopicHeader';
import NestedTopicList from './NestedTopicList';
import { YooptaContentValue, YooptaOnChangeOptions } from '@yoopta/editor';

const DraggableTopicItem: React.FC<TopicNodeProps> = ({ id, index }) => {
  const dispatch = useDispatch<AppDispatch>();
  const topic = useSelector((state: RootState) => state.topics.topics[id]);

  if (!topic) return null;

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateTopic({ id, updates: { name: e.target.value } }));
    },
    [dispatch, id]
  );

  const handleDelete = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to delete this topic and all its subtopics?'
      )
    ) {
      dispatch(deleteTopic(id));
    }
  }, [dispatch, id]);

  const handleAddSubtopic = useCallback(() => {
    const newTopic = {
      id: Date.now().toString(),
      name: 'New Topic',
      content: '{}', // Initialize with empty object JSON string
      no: `${topic.no}-${topic.children.length + 1}`,
      children: [],
      isExpanded: false,
    };
    dispatch(addTopic({ parentId: id, newTopic }));
  }, [dispatch, id, topic.no, topic.children.length]);

  const handleToggleExpand = useCallback(() => {
    dispatch(toggleExpand(id));
  }, [dispatch, id]);

  // Parse string content to YooptaContentValue or provide empty object if parsing fails
  const parsedContent = useCallback((content: string): YooptaContentValue => {
    try {
      return JSON.parse(content) as YooptaContentValue;
    } catch (e) {
      // Return an empty object if parsing fails
      return {} as YooptaContentValue;
    }
  }, []);

  const handleEditorChange = useCallback(
    (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
      // Convert YooptaContentValue to string before storing
      dispatch(
        updateTopic({ id, updates: { content: JSON.stringify(newValue) } })
      );
    },
    [dispatch, id]
  );

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          className="topic-node mb-3"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <TopicHeader
            topic={topic}
            handleNameChange={handleNameChange}
            handleToggleExpand={handleToggleExpand}
            handleAddSubtopic={handleAddSubtopic}
            handleDelete={handleDelete}
            dragHandleProps={provided.dragHandleProps}
          />

          {topic.isExpanded && (
            <div className="ml-2 sm:ml-6 mt-2">
              <TopicContentEditor
                value={parsedContent(topic.content)}
                onChange={handleEditorChange}
                readOnly={false}
              />
              {topic.children.length > 0 && <NestedTopicList parentId={id} />}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableTopicItem;
