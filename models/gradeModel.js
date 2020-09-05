export default (moongose) => {
  const schema = moongose.Schema({
    name: {
      type: String,
      required: [true, 'Informe o nome'],
    },
    subject: {
      type: String,
      required: [true, 'Informe a materia'],
    },
    type: {
      type: String,
      required: [true, 'Informe o tipo da nota'],
    },
    value: {
      type: Number,
      required: [true, 'Informe a nota'],
      validate(value) {
        if (value < 0) {
          throw new Error('A nota tem ser maior que zero');
        }
      },
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  });

  const gradeModel = moongose.model('grade', schema, 'grade');

  return gradeModel;
};
