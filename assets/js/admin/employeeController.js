$(document).ready(function () {
    $('#example').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        lengthChange: true, // ✅ Hiển thị combobox chọn số dòng
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        responsive: true
    });
});


const provinceSelect = document.getElementById('province');
const districtSelect = document.getElementById('district');
const wardSelect = document.getElementById('ward');

function setDisabled(select, disabled, placeholder = "Chọn...") {
    select.disabled = disabled;
    if (disabled) select.innerHTML = `<option selected disabled value="">${placeholder}</option>`;
}

// Lấy danh sách tỉnh/thành
function fetchProvinces() {
    fetch('https://provinces.open-api.vn/api/p/')
        .then(res => res.json())
        .then(data => {
            provinceSelect.innerHTML = `<option selected disabled value="">Chọn tỉnh/thành phố...</option>`;
            data.forEach(province => {
                const option = document.createElement('option');
                option.value = province.code; // mã tỉnh
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });
        })
        .catch(() => alert('Lỗi lấy danh sách tỉnh/thành phố'));
}

// Lấy quận/huyện theo tỉnh
provinceSelect.addEventListener('change', () => {
    const provinceCode = provinceSelect.value;
    if (!provinceCode) {
        setDisabled(districtSelect, true, "Chọn quận/huyện...");
        setDisabled(wardSelect, true, "Chọn xã/phường...");
        return;
    }

    setDisabled(districtSelect, false, "Chọn quận/huyện...");
    setDisabled(wardSelect, true, "Chọn xã/phường...");

    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        .then(res => res.json())
        .then(data => {
            const districts = data.districts || [];
            districtSelect.innerHTML = `<option selected disabled value="">Chọn quận/huyện...</option>`;
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.code; // mã quận
                option.textContent = district.name;
                districtSelect.appendChild(option);
            });
        })
        .catch(() => alert('Lỗi lấy danh sách quận/huyện'));
});

// Lấy xã/phường theo quận
districtSelect.addEventListener('change', () => {
    const districtCode = districtSelect.value;
    if (!districtCode) {
        setDisabled(wardSelect, true, "Chọn xã/phường...");
        return;
    }

    setDisabled(wardSelect, false, "Chọn xã/phường...");

    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
        .then(res => res.json())
        .then(data => {
            const wards = data.wards || [];
            wardSelect.innerHTML = `<option selected disabled value="">Chọn xã/phường...</option>`;
            wards.forEach(ward => {
                const option = document.createElement('option');
                option.value = ward.code; // mã xã/phường
                option.textContent = ward.name;
                wardSelect.appendChild(option);
            });
        })
        .catch(() => alert('Lỗi lấy danh sách xã/phường'));
});

// Load tỉnh/thành lúc đầu
fetchProvinces();
