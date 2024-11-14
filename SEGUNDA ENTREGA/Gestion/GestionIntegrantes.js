document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('member-form');
    const membersTable = document.getElementById('members-table').getElementsByTagName('tbody')[0];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const role = document.getElementById('role').value;
        const fact = document.getElementById('fact').value;
        const image = document.getElementById('image').files[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            const newRow = membersTable.insertRow();
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${role}</td>
                <td>${fact}</td>
                <td><img src="${e.target.result}" alt="${name}" width="50"></td>
                <td><button class="delete-btn">Eliminar</button></td>
            `;
        };
        reader.readAsDataURL(image);

        form.reset();
    });

    membersTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const row = e.target.closest('tr');
            row.remove();
        }
    });

    document.getElementById('edit').addEventListener('click', () => {
        const selectedRow = membersTable.querySelector('tr.selected');
        if (selectedRow) {
            document.getElementById('name').value = selectedRow.cells[0].innerText;
            document.getElementById('role').value = selectedRow.cells[1].innerText;
            document.getElementById('fact').value = selectedRow.cells[2].innerText;
            selectedRow.remove();
        }
    });

    membersTable.addEventListener('click', (e) => {
        const rows = membersTable.getElementsByTagName('tr');
        for (let row of rows) {
            row.classList.remove('selected');
        }
        e.target.parentNode.classList.add('selected');
    });
});
