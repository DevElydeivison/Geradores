// Geradores locais de dados sintéticos. Não verificam existência ou titularidade.
export function randomInt(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) throw new RangeError('Intervalo inválido');
  const range = max - min + 1;
  const maxUint = 0x100000000;
  const limit = Math.floor(maxUint / range) * range;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return min + (buf[0] % range);
}
export const pick = list => list[randomInt(0, list.length - 1)];
const digits = (n) => Array.from({ length: n }, () => randomInt(0, 9)).join('');
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letter = () => letters[randomInt(0, letters.length - 1)];

export function cpf() {
  // Dígitos verificadores válidos; não equivale a CPF cadastrado na Receita Federal.
  let base;
  do { base = Array.from({ length: 9 }, () => randomInt(0, 9)); }
  while (base.every(d => d === base[0]));
  for (let size = 9; size <= 10; size++) {
    const sum = base.reduce((acc, digit, index) => acc + digit * (size + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    base.push(remainder === 10 ? 0 : remainder);
  }
  const s = base.join('');
  return `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-${s.slice(9)}`;
}
export function password(length = 16, options = {}) {
  const { upper = true, lower = true, numbers = true, symbols = true } = options;
  const groups = [upper && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower && 'abcdefghijklmnopqrstuvwxyz', numbers && '0123456789', symbols && '!@#$%&*_-+=?'].filter(Boolean);
  if (!groups.length) throw new Error('Selecione ao menos um grupo de caracteres.');
  const size = Math.max(groups.length, Math.min(128, Math.max(4, Number(length) || 16)));
  const pool = groups.join('');
  const result = groups.map(group => pick([...group]));
  while (result.length < size) result.push(pick([...pool]));
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i); [result[i], result[j]] = [result[j], result[i]];
  }
  return result.join('');
}
export function phone() {
  // Formato de celular brasileiro, sem garantia de número não atribuído.
  const ddd = pick(['11','21','27','31','41','47','48','51','61','62','71','79','81','82','83','84','85','86','91','92','98']);
  return `(${ddd}) 9${digits(4)}-${digits(4)}`;
}
export function cep() { return `${digits(5)}-${digits(3)}`; }
export function plateMercosul() { return `${letter()}${letter()}${letter()}${digits(1)}${letter()}${digits(2)}`; }
export function plateOld() { return `${letter()}${letter()}${letter()}-${digits(4)}`; }
const firstNames = ['Ana','Alice','Amanda','Beatriz','Bianca','Bruna','Camila','Carolina','Clara','Daniela','Eduarda','Fernanda','Gabriela','Helena','Isabela','Júlia','Larissa','Letícia','Luana','Mariana','Maria','Natália','Rafaela','Sofia','Vitória','André','Arthur','Bruno','Caio','Carlos','Daniel','Davi','Diego','Eduardo','Felipe','Gabriel','Guilherme','Henrique','João','José','Leonardo','Lucas','Luiz','Mateus','Miguel','Pedro','Rafael','Ricardo','Thiago','Vinícius'];
const surnames = ['Almeida','Alves','Araújo','Barbosa','Barros','Batista','Cardoso','Carvalho','Castro','Costa','Dias','Fernandes','Ferreira','Gomes','Lima','Lopes','Machado','Martins','Melo','Mendes','Monteiro','Moreira','Nascimento','Oliveira','Pereira','Ramos','Ribeiro','Rocha','Rodrigues','Santos','Silva','Sousa','Souza','Teixeira'];
export function fullName() { const first = pick(firstNames); let a = pick(surnames), b = pick(surnames); while (a === b) b = pick(surnames); return `${first} ${a} ${b}`; }
export function identity() { return { nome: fullName(), cpf: cpf(), senha: password(16), telefone: phone(), cep: cep(), placaMercosul: plateMercosul(), placaAntiga: plateOld() }; }
export const generators = [
  { id:'password', icon:'⌘', category:'SEGURANÇA', title:'Senha segura', description:'Senhas aleatórias com comprimento e caracteres configuráveis.', format:'Ex.: K8@qP2!x', generate: opts => password(opts.length, opts) },
  { id:'cpf', icon:'▦', category:'DOCUMENTOS', title:'CPF', description:'CPF fictício com dígitos verificadores matematicamente válidos.', format:'Ex.: 000.000.000-00', generate:cpf },
  { id:'phone', icon:'◉', category:'CONTATO', title:'Telefone', description:'Números de celular no formato brasileiro com DDD.', format:'Ex.: (81) 9XXXX-XXXX', generate:phone },
  { id:'cep', icon:'⌖', category:'ENDEREÇO', title:'CEP', description:'Sequências de oito dígitos no formato de CEP brasileiro.', format:'Ex.: 00000-000', generate:cep },
  { id:'mercosul', icon:'▤', category:'VEÍCULOS', title:'Placa Mercosul', description:'Placas no padrão brasileiro atual (LLLNLNN).', format:'Ex.: ABC1D23', generate:plateMercosul },
  { id:'old', icon:'▥', category:'VEÍCULOS', title:'Placa antiga', description:'Placas no padrão brasileiro anterior (LLL-NNNN).', format:'Ex.: ABC-1234', generate:plateOld },
  { id:'name', icon:'♙', category:'PESSOAS', title:'Nome completo', description:'Combinações fictícias de nomes e sobrenomes brasileiros.', format:'Ex.: João Silva Costa', generate:fullName },
];
