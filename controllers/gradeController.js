import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const gradeModel = db.grade;

const create = async (req, res) => {
  try {
    const grade = new gradeModel(req.body);
    await grade.save();
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify(grade)}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  if (!!name) {
    //condicao para o filtro no findAll
    var condition = name
      ? { name: { $regex: new RegExp(name), $options: 'i' } }
      : {};
  }

  try {
    let grades = [];
    if (!!condition) {
      grades = await gradeModel.find(condition);
    } else {
      grades = await gradeModel.find();
    }

    res.send(grades);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await gradeModel.findOne({ _id: id });
    res.send(grade);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const grade = await gradeModel.findByIdAndUpdate({ _id: id }, req.body);
    let msg = '';
    let status = 200;

    if (!!grade) {
      logger.info(`PUT /grade - ${id} - ${JSON.stringify(grade)}`);
      msg = `Dados atualizados-${id} - ${JSON.stringify(req.body)} `;
    } else {
      status = 404;
      msg = `Dados atualizados nao encontrado-${id} `;
    }
    res.status(status).send({ message: msg });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    let msg = `DELETE /grade - ${id}`;
    let status = 200;
    const gradeExc = await gradeModel.findByIdAndDelete({ _id: id });
    if (gradeExc === null) {
      msg = `DELETE /grade - nao encontrado ${id}`;
      status = 404;
    }
    logger.info(msg);
    res.status(status).send({ message: msg });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    let msg = `DELETE /grade`;
    let status = 200;
    const gradeAll = await gradeModel.deleteMany();
    if (gradeAll === null) {
      msg = `DELETE /grade - nenhum dados para ser excluido`;
      status = 404;
    }
    logger.info(msg);
    res.status(status).send({ message: msg });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
