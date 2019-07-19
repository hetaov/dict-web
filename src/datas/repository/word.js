// @flow
import {Connection, Repository} from 'typeorm';
import getRepository from '../orm/conn';
import {Word} from '../entity/Word';

export default () =>
  getRepository
    .then((con: Connection) => con.getRepository(Word))
    .then((repo: Repository) => repo);
