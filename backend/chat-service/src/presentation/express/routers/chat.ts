import { Router } from "express";
import authMiddleware from '../../../infra/http/middleware/authMiddleware';
import CreateIndividualChatController from '../../../infra/http/controllers/CreateIndividualChatController';
import CreateGroupChatController from '../../../infra/http/controllers/CreateGroupChatController';
import GetUserChatsController from '../../../infra/http/controllers/GetUserChatsController';
import GetChatByIdController from '../../../infra/http/controllers/GetChatByIdController';
import GetChatMessagesController from '../../../infra/http/controllers/GetChatMessagesController';
import SendMessageController from '../../../infra/http/controllers/SendMessageController';
import AddUserToGroupChatController from '../../../infra/http/controllers/AddUserToGroupChatController';
import RemoveUserFromGroupChatController from '../../../infra/http/controllers/RemoveUserFromGroupChatController';
import UpdateChatController from '../../../infra/http/controllers/UpdateChatController';
import DeleteChatController from '../../../infra/http/controllers/DeleteChatController';
import GetUserGroupChatsController from '../../../infra/http/controllers/GetUserGroupChatsController';

const chatRouter = Router();

const createIndividualChatController = new CreateIndividualChatController();
const createGroupChatController = new CreateGroupChatController();
const getUserChatsController = new GetUserChatsController();
const getChatByIdController = new GetChatByIdController();
const getChatMessagesController = new GetChatMessagesController();
const sendMessageController = new SendMessageController();
const addUserToGroupChatController = new AddUserToGroupChatController();
const removeUserFromGroupChatController = new RemoveUserFromGroupChatController();
const updateChatController = new UpdateChatController();
const deleteChatController = new DeleteChatController();
const getUserGroupChatsController = new GetUserGroupChatsController();

chatRouter.post("/individual", authMiddleware, createIndividualChatController.handle);
chatRouter.post("/group", authMiddleware, createGroupChatController.handle);
chatRouter.get("/user/chats", authMiddleware, getUserChatsController.handle);
chatRouter.get("/:chatId", authMiddleware, getChatByIdController.handle);
chatRouter.get("/:chatId/messages", authMiddleware, getChatMessagesController.handle);
chatRouter.post("/message", authMiddleware, sendMessageController.handle);
chatRouter.post("/:chatId/add-user", authMiddleware, addUserToGroupChatController.handle);
chatRouter.post("/:chatId/remove-user", authMiddleware, removeUserFromGroupChatController.handle);
chatRouter.put("/:chatId", authMiddleware, updateChatController.handle);
chatRouter.delete("/:chatId", authMiddleware, deleteChatController.handle);
chatRouter.get("/user/group-chats", authMiddleware, getUserGroupChatsController.handle);

export default chatRouter;