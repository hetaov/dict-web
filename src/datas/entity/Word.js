// @flow
import {Entity, Column, ObjectIdColumn} from 'typeorm';
import {ObjectID} from 'mongodb';

@Entity()
export class Word {
  @ObjectIdColumn()
  id: ObjectID;
  @Column('text', {nullable: true})
  name: string;
  @Column('boolean', {default: false})
  complete: boolean;
  @Column('text')
  desc: string;
}
