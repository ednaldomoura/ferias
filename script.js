let vacations = JSON.parse(localStorage.getItem('vacations') || '[]');
let editIndex = null;

const form = document.getElementById('vacationForm');
const tableBody = document.querySelector('#vacationTable tbody');

function saveVacations() {
    localStorage.setItem('vacations', JSON.stringify(vacations));
}

function formatDateBR(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function renderTable() {
    tableBody.innerHTML = '';
    vacations.forEach((vac, idx) => {
        const periodAquisitivo = `${formatDateBR(vac.periodStart)} até ${formatDateBR(vac.periodEnd)}`;
        const gozo = `${formatDateBR(vac.startDate)} até ${formatDateBR(vac.endDate)}`;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${vac.name}</td>
            <td>${vac.role}</td>
            <td>${periodAquisitivo}</td>
            <td>${gozo}</td>
            <td>${vac.days}</td>
            <td>${vac.thirteenth ? 'Sim' : 'Não'}</td>
            <td>
                <button class="edit" onclick="editVacation(${idx})">Editar</button>
                <button onclick="deleteVacation(${idx})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

form.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const role = document.getElementById('role').value.trim();
    const periodStart = document.getElementById('periodStart').value;
    const periodEnd = document.getElementById('periodEnd').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const days = document.getElementById('days').value;
    const thirteenth = document.getElementById('thirteenth').checked;
    if (editIndex === null) {
        vacations.push({ name, role, periodStart, periodEnd, startDate, endDate, days, thirteenth });
    } else {
        vacations[editIndex] = { name, role, periodStart, periodEnd, startDate, endDate, days, thirteenth };
        editIndex = null;
        form.querySelector('button[type="submit"]').textContent = 'Adicionar Férias';
    }
    saveVacations();
    form.reset();
    renderTable();
};

window.editVacation = function(idx) {
    const vac = vacations[idx];
    document.getElementById('name').value = vac.name;
    document.getElementById('role').value = vac.role;
    document.getElementById('periodStart').value = vac.periodStart;
    document.getElementById('periodEnd').value = vac.periodEnd;
    document.getElementById('startDate').value = vac.startDate;
    document.getElementById('endDate').value = vac.endDate;
    document.getElementById('days').value = vac.days;
    document.getElementById('thirteenth').checked = vac.thirteenth;
    editIndex = idx;
    form.querySelector('button[type="submit"]').textContent = 'Salvar Alteração';
};

window.deleteVacation = function(idx) {
    if (confirm('Tem certeza que deseja excluir este registro de férias?')) {
        vacations.splice(idx, 1);
        saveVacations();
        renderTable();
    }
};

function exportCSV() {
    if (vacations.length === 0) return alert('Nenhum registro para exportar!');
    const header = ['Nome', 'Cargo', 'Período Aquisitivo', 'Gozo', 'Dias', '13º'];
    const rows = vacations.map(vac => [
        vac.name,
        vac.role,
        `${vac.periodStart} até ${vac.periodEnd}`,
        `${vac.startDate} até ${vac.endDate}`,
        vac.days,
        vac.thirteenth ? 'Sim' : 'Não'
    ]);
    let csvContent = header.join(';') + '\n';
    rows.forEach(row => {
        csvContent += row.join(';') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ferias_funcionarios.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportPDF() {
    if (vacations.length === 0) return alert('Nenhum registro para exportar!');
    const win = window.open('', '', 'width=900,height=700');
    win.document.write('<html><head><title>Férias Funcionários</title>');
    win.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #888;padding:6px;text-align:center;}th{background:#2575fc;color:#fff;}</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>Férias Programadas</h2>');
    win.document.write('<table>');
    win.document.write('<thead><tr><th>Nome</th><th>Cargo</th><th>Período Aquisitivo</th><th>Gozo</th><th>Dias</th><th>13º</th></tr></thead>');
    win.document.write('<tbody>');
    vacations.forEach(vac => {
        win.document.write('<tr>');
        win.document.write(`<td>${vac.name}</td>`);
        win.document.write(`<td>${vac.role}</td>`);
        win.document.write(`<td>${vac.periodStart} até ${vac.periodEnd}</td>`);
        win.document.write(`<td>${vac.startDate} até ${vac.endDate}</td>`);
        win.document.write(`<td>${vac.days}</td>`);
        win.document.write(`<td>${vac.thirteenth ? 'Sim' : 'Não'}</td>`);
        win.document.write('</tr>');
    });
    win.document.write('</tbody></table>');
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

// Adiciona botões de exportação ao carregar a página
window.addEventListener('DOMContentLoaded', function() {
    const btnsDiv = document.createElement('div');
    btnsDiv.style.display = 'flex';
    btnsDiv.style.justifyContent = 'flex-end';
    btnsDiv.style.gap = '10px';
    btnsDiv.style.marginBottom = '10px';
    btnsDiv.innerHTML = `
        <button id="exportCSV" style="background:#43a047;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;">Exportar CSV</button>
        <button id="exportPDF" style="background:#d32f2f;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;">Exportar PDF</button>
    `;
    document.querySelector('.list-section').insertBefore(btnsDiv, document.querySelector('.list-section table'));
    document.getElementById('exportCSV').onclick = exportCSV;
    document.getElementById('exportPDF').onclick = exportPDF;
});

renderTable();
