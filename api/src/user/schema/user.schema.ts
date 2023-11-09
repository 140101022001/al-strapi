import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  _id: string;

  @Prop({ unique: [true, 'Duplicate email entered!'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
