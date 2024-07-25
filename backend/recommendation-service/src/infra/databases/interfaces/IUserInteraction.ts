import { Document } from 'mongoose';
import { UserInteraction } from '../../../domain/entities/UserInteraction';

export interface IUserInteraction extends UserInteraction, Document { }