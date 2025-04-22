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
      content: '',
      no: `${topic.no}-${topic.children.length + 1}`,
      children: [],
      isExpanded: false,
    };
    dispatch(addTopic({ parentId: id, newTopic }));
  }, [dispatch, id, topic.no, topic.children.length]);

  const handleToggleExpand = useCallback(() => {
    dispatch(toggleExpand(id));
  }, [dispatch, id]);

  const handleEditorChange = useCallback(
    (newValue: any) => {
      dispatch(updateTopic({ id, updates: { content: newValue } }));
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
                value={topic.content}
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
