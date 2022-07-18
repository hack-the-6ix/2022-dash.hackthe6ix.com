import { addMethod, string } from 'yup';

addMethod(
  string,
  'count',
  function (count: number, message = `\${path} must be within ${count} words`) {
    return this.test('word-count', message, (value = '') => {
      return value?.split(/ */g).length <= count;
    });
  }
);
