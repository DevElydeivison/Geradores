import { generators, identity } from './generators.js';
const $ = selector => document.querySelector(selector);
const grid = $('#generator-grid');
const dialog = $('#generator-dialog');
let active = generators[0];
let values = [];
let profile = null;
let identityCount = 0;
let toastTimer;

function toast(message) {
  const node = $('#toast'); node.textContent = message; node.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 2500);
}
async function copy(value) {
  try { await navigator.clipboard.writeText(value); toast('Copiado para a área de transferência!'); }
  catch { toast('Não foi possível copiar. Use localhost ou HTTPS.'); }
}
for (const [index, item] of generators.entries()) {
  const button = document.createElement('button');
  button.className = 'generator-card'; button.type = 'button';
  button.innerHTML = `<div class="card-top"><span class="card-icon">${item.icon}</span><span class="card-index">0${index + 1}</span></div><span class="card-category">${item.category}</span><h3>${item.title}</h3><p>${item.description}</p><div class="card-bottom"><span>${item.format}</span><span class="card-arrow">↗</span></div>`;
  button.addEventListener('click', () => openGenerator(item));
  grid.append(button);
}
function openGenerator(item) {
  active = item;
  $('#dialog-title').textContent = item.title;
  $('#dialog-description').textContent = item.description;
  const options = $('#generator-options'); options.replaceChildren();
  const wrapper = document.createElement('div'); wrapper.className = 'options-row';
  wrapper.innerHTML = `<label for="quantity">Quantidade <span>(1–20)</span></label><input id="quantity" type="number" min="1" max="20" value="5" />`;
  options.append(wrapper);
  if (item.id === 'password') {
    const extra = document.createElement('div'); extra.className = 'password-options';
    extra.innerHTML = `<label for="password-length">Comprimento <span id="length-value">16</span></label><input id="password-length" type="range" min="8" max="64" value="16" /><div class="checkboxes"><label><input type="checkbox" id="upper" checked /> Maiúsculas</label><label><input type="checkbox" id="lower" checked /> Minúsculas</label><label><input type="checkbox" id="numbers" checked /> Números</label><label><input type="checkbox" id="symbols" checked /> Símbolos</label></div>`;
    options.append(extra);
    $('#password-length').addEventListener('input', event => { $('#length-value').textContent = event.target.value; });
  }
  generateResults(); dialog.showModal();
}
function generateResults() {
  const quantity = Math.max(1, Math.min(20, Number.parseInt($('#quantity').value, 10) || 1));
  $('#quantity').value = quantity;
  const options = active.id === 'password' ? { length: Number($('#password-length').value), upper: $('#upper').checked, lower: $('#lower').checked, numbers: $('#numbers').checked, symbols: $('#symbols').checked } : {};
  try { values = Array.from({ length: quantity }, () => active.generate(options)); }
  catch (error) { toast(error.message); return; }
  $('#result-count').textContent = `${quantity} GERADO${quantity > 1 ? 'S' : ''}`;
  const container = $('#generator-results'); container.replaceChildren();
  values.forEach((value, index) => {
    const row = document.createElement('div'); row.className = 'result-row';
    const number = document.createElement('span'); number.className = 'result-index'; number.textContent = String(index + 1).padStart(2, '0');
    const code = document.createElement('code'); code.textContent = value;
    const btn = document.createElement('button'); btn.className = 'copy-btn'; btn.type = 'button'; btn.textContent = '⧉'; btn.setAttribute('aria-label', `Copiar resultado ${index + 1}`); btn.addEventListener('click', () => copy(value));
    row.append(number, code, btn); container.append(row);
  });
}
$('#generate-results').addEventListener('click', generateResults);
$('#copy-results').addEventListener('click', () => values.length && copy(values.join('\n')));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const profileLabels = [['cpf','CPF'],['senha','SENHA'],['telefone','TELEFONE'],['cep','CEP'],['placaMercosul','PLACA MERCOSUL'],['placaAntiga','PLACA ANTIGA']];
$('#generate-identity').addEventListener('click', () => {
  profile = identity(); identityCount++;
  $('#identity-sequence').textContent = `#${String(identityCount).padStart(4,'0')}`;
  $('#identity-name').textContent = profile.nome;
  $('#identity-avatar').textContent = profile.nome.split(' ').slice(0, 2).map(s => s[0]).join('');
  const fields = $('#identity-fields'); fields.replaceChildren();
  for (const [key, label] of profileLabels) {
    const row = document.createElement('div'); row.className = 'identity-field';
    const content = document.createElement('div'); const small = document.createElement('span'); small.textContent = label; const code = document.createElement('code'); code.textContent = profile[key]; content.append(small, code);
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'copy-btn'; btn.textContent = '⧉'; btn.setAttribute('aria-label', `Copiar ${label}`); btn.addEventListener('click', () => copy(profile[key]));
    row.append(content, btn); fields.append(row);
  }
  $('#copy-identity').disabled = false;
});
$('#copy-identity').addEventListener('click', () => {
  if (!profile) return;
  copy([`Nome: ${profile.nome}`, ...profileLabels.map(([key,label]) => `${label}: ${profile[key]}`), 'DADOS SINTÉTICOS PARA TESTES'].join('\n'));
});
