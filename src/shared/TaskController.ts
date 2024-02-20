import { Allow, BackendMethod, remult } from "remult";
import { Task } from './Task';

// ensure that when an entity is being hidden behind authentication by setting it's "AllowApiCrud" property to "Allow.authenticated"  that it's set on the respective controller class too. Other wise that code is still open to crud operations.
export class TaskController {
	@BackendMethod({ allowed: Allow.authenticated })
	static async setAllCompleted(completed: boolean) {
		// this variable basically says, "hey remult I want to create this variable to keep track of this repo(DataBase Schema), and be able to perform DB operations through i"
		const taskRepo = remult.repo(Task);

		for (const task of await taskRepo.find()) {
			await taskRepo.save({ ...task, completed })
		}
	}
}