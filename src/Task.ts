import { Field, Entity, IdEntity, Validators, Remult, BackendMethod, Allow } from "remult";
import { Roles } from "./Roles";

@Entity("tasks", {
    allowApiCrud: Allow.authenticated,
    allowApiDelete:Roles.admin,
    allowApiInsert:Roles.admin
})
export class Task extends IdEntity {
    @Field({
        validate: Validators.required,
        allowApiUpdate:Roles.admin
    })
    title: string = '';
    @Field()
    completed: boolean = false;


    @BackendMethod({ allowed: Roles.admin })
    static async setAll(completed: boolean, remult?: Remult) {
        for await (const task of remult!.repo(Task).iterate()) {
            task.completed = completed;
            await task.save();
        }
    }

}
