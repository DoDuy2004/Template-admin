$(document).ready(function () {
    const products = [
        { id: "ABC123XYZ21", name: "Mô Hình Luffy Gear 5", price: 9999999, image: "https://via.placeholder.com/50" },
        { id: "ABC123XYZ22", name: "Mô Hình Zoro Gear 4", price: 1000000, image: "https://via.placeholder.com/50" },
        { id: "ABC123XYZ23", name: "Mô Hình Sanji", price: 1100000, image: "https://via.placeholder.com/50" },
        { id: "ABC123XYZ24", name: "Mô Hình Nami", price: 1200000, image: "https://via.placeholder.com/50" },
    ];

    // Hiển thị danh sách tìm kiếm theo thời gian thực
    $('#searchProduct').on('input', function () {
        const searchValue = $(this).val().toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue) || product.id.toLowerCase().includes(searchValue));

        const productList = $('#productList');
        productList.empty();

        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                productList.append(`
                    <li class="list-group-item d-flex align-items-center">
                        <img src="${product.image}" alt="${product.name}" class="product-img me-3" data-id="${product.id}" style="width: 50px; height: 50px;">
                        <div>
                            <strong>${product.name}</strong><br>
                            <small>Mã: ${product.id}</small>
                        </div>
                    </li>
                `);
            });
            productList.show(); // Hiển thị danh sách
        } else {
            productList.append('<li class="list-group-item text-center text-muted">Không tìm thấy sản phẩm</li>');
            productList.show();
        }
    });

    // Thêm sản phẩm khi nhấn vào ảnh
    $('#productList').on('click', '.product-img', function () {
        const productId = $(this).data('id');
        const product = products.find(p => p.id === productId);

        const existingRow = $(`#productTable tr[data-id="${product.id}"]`);
        if (existingRow.length > 0) {
            const quantityInput = existingRow.find('.quantity-input');
            quantityInput.val(parseInt(quantityInput.val(), 10) + 1);
            updateTotalPrice(existingRow);
        } else {
            $('#productTable tbody').append(renderProductRow(product));
        }

        $('#productList').hide(); // Ẩn danh sách tìm kiếm sau khi chọn
        $('#searchProduct').val(''); // Xóa giá trị tìm kiếm
    });

    function renderProductRow(product, quantity = 1) {
        return `
            <tr data-id="${product.id}">
                <td>${product.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;">
                        <span class="ms-2">${product.name}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-quantity btn-decrease">-</button>
                        <input type="number" class="form-control mx-2 quantity-input" value="${quantity}" min="1" style="width: 60px;">
                        <button class="btn btn-outline-secondary btn-quantity btn-increase">+</button>
                    </div>
                </td>
                <td><input type="number" class="form-control input-price" value="${product.price}" min="0"></td>
                <td class="total-price">${(product.price * quantity).toLocaleString()} VND</td>
                <td>
                    <button class="btn btn-danger btn-delete">Xóa</button>
                </td>
            </tr>
        `;
    }

    function updateTotalPrice(row) {
        const price = parseInt(row.find('.input-price').val(), 10);
        const quantity = parseInt(row.find('.quantity-input').val(), 10);
        const totalPrice = price * quantity;
        row.find('.total-price').text(totalPrice.toLocaleString() + " VND");
    }

    // Ẩn danh sách khi nhấn ngoài vùng
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#searchProduct, #productList').length) {
            $('#productList').hide();
        }
    });

    // Xử lý thay đổi giá nhập
    $('#productTable').on('input', '.input-price', function () {
        const row = $(this).closest('tr');
        updateTotalPrice(row);
    });

    // Xử lý tăng/giảm số lượng và xóa sản phẩm
    $('#productTable').on('click', '.btn-increase', function () {
        const row = $(this).closest('tr');
        const quantityInput = row.find('.quantity-input');
        quantityInput.val(parseInt(quantityInput.val(), 10) + 1);
        updateTotalPrice(row);
    });

    $('#productTable').on('click', '.btn-decrease', function () {
        const row = $(this).closest('tr');
        const quantityInput = row.find('.quantity-input');
        if (parseInt(quantityInput.val(), 10) > 1) {
            quantityInput.val(parseInt(quantityInput.val(), 10) - 1);
            updateTotalPrice(row);
        }
    });

    $('#productTable').on('click', '.btn-delete', function () {
        $(this).closest('tr').remove();
    });
});