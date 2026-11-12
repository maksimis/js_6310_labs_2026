import { Keyboard } from 'vk-io';

const LETTERS = ['A', 'B', 'C', 'D'];

function buildButton(label, command, color) {
  return {
    label,
    payload: JSON.stringify({ command }),
    color
  };
}

export function mainMenuKeyboard() {
  return Keyboard.builder()
    .textButton(buildButton('/gen_task', 'gen_task', Keyboard.PRIMARY_COLOR))
    .textButton(buildButton('/check help', 'check_help', Keyboard.SECONDARY_COLOR))
    .textButton(buildButton('/stats', 'stats', Keyboard.SECONDARY_COLOR))
    .inline(false);
}

export function topicKeyboard() {
  return Keyboard.builder()
    .textButton(buildButton('js', 'topic_js', Keyboard.PRIMARY_COLOR))
    .textButton(buildButton('node', 'topic_node', Keyboard.PRIMARY_COLOR))
    .textButton(buildButton('db', 'topic_db', Keyboard.PRIMARY_COLOR))
    .row()
    .textButton(buildButton('Меню', 'menu', Keyboard.SECONDARY_COLOR))
    .inline(false);
}

export function typeKeyboard() {
  return Keyboard.builder()
    .textButton(buildButton('theory', 'type_theory', Keyboard.PRIMARY_COLOR))
    .textButton(buildButton('test', 'type_test', Keyboard.PRIMARY_COLOR))
    .row()
    .textButton(buildButton('Меню', 'menu', Keyboard.SECONDARY_COLOR))
    .inline(false);
}

export function answersKeyboard(options) {
  const kb = Keyboard.builder();
  options.forEach((_, i) => {
    kb.textButton(
      buildButton(LETTERS[i], `answer_${LETTERS[i]}`, Keyboard.SECONDARY_COLOR)
    );
  });
  kb.row();
  kb.textButton(buildButton('Меню', 'menu', Keyboard.SECONDARY_COLOR));
  return kb.inline(false);
}