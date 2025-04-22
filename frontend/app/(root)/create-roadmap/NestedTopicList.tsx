import { RootState } from '@/redux';
import { Droppable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import DraggableTopicItem from './RoadmapTopicNode';

interface NestedTopicListProps {
  parentId: string;
}

const NestedTopicList: React.FC<NestedTopicListProps> = ({ parentId }) => {
  const children = useSelector(
    (state: RootState) => state.topics.topics[parentId].children
  );

  return (
    <Droppable droppableId={parentId} type={`topic-list-${parentId}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="topic-children"
        >
          {children.map((childId, index) => (
            <DraggableTopicItem key={childId} id={childId} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default NestedTopicList;
