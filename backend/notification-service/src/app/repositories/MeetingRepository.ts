import Meeting, { IMeeting } from '../../infra/databases/mongoose/models/Meeting';

export default class MeetingRepository {
  public async save(meetingData: IMeeting): Promise<IMeeting> {
    try {
      const meeting = new Meeting(meetingData);
      return await meeting.save();
    } catch (error) {
      console.error('Error saving meeting:', error);
      throw error;
    }
  }

  public async findByUserEmail(userEmail: string): Promise<IMeeting[]> {
    try {
      return await Meeting.find({
        $or: [
          { createdBy: userEmail },
          { invitedUsers: userEmail }
        ]
      }).sort({ scheduledTime: 1 });
    } catch (error) {
      console.error('Error finding meetings:', error);
      throw error;
    }
  }
}