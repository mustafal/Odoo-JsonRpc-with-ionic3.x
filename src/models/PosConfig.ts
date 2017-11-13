import { BaseModel } from "../services/base_model";
import { model } from "../services/model";

@model
export class PosConfig extends BaseModel {
    model_name: string;
    id: number;
    name: string;
}