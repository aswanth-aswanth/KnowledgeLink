import MeetingRepository from '../repositories/MeetingRepository';

export default class GetUserMeetings {
    private meetingRepository: MeetingRepository;

    constructor(meetingRepository: MeetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    public async execute(userEmail: string): Promise<any> {
        const meetings = await this.meetingRepository.findByUserEmail(userEmail);
        return meetings;
    }
}