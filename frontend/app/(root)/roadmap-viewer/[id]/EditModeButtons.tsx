import { Button } from '@/components/ui/button';
import { EditModeButtonsProps } from '@/types/roadmap';

export default function EditModeButtons({
  pathname,
  isEditMode,
  setIsEditMode,
  contributions,
  handleSubmit,
}: EditModeButtonsProps) {
  if (pathname.split('/')[1] === 'roadmap-viewer') {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <div>
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          variant="outline"
          className="mr-2"
        >
          {isEditMode ? 'View Mode' : 'Edit Mode'}
        </Button>
        {isEditMode && Object.keys(contributions).length > 0 && (
          <Button onClick={handleSubmit}>Submit Contribution</Button>
        )}
      </div>
    </div>
  );
}
