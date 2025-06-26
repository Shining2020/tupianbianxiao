// 获取页面元素
const imageInput = document.getElementById('imageInput');
const qualityRange = document.getElementById('qualityRange');
const qualityValue = document.getElementById('qualityValue');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 用于存储压缩后的图片数据
let compressedBlob = null;
let lastFileType = '';

// 监听压缩比例滑块变化，实时显示数值
qualityRange.addEventListener('input', function() {
    qualityValue.textContent = qualityRange.value + '%';
    // 如果已有图片，自动重新压缩
    if (originalImage.src) {
        compressImage();
    }
});

// 监听图片上传
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    // 只支持 PNG 和 JPG/JPEG
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
        alert('只支持 PNG 和 JPG 格式的图片！');
        return;
    }
    lastFileType = file.type;
    // 如果是 PNG，提示用户透明会丢失
    if (file.type === 'image/png') {
        alert('PNG 图片压缩后将转为 JPG 格式，透明部分会变成白色。');
    }
    // 显示原图预览
    const reader = new FileReader();
    reader.onload = function(evt) {
        originalImage.src = evt.target.result;
        // 显示原图大小
        originalSize.textContent = formatSize(file.size);
        // 预览图片加载后再压缩
        originalImage.onload = function() {
            compressImage();
        };
    };
    reader.readAsDataURL(file);
});

// 图片压缩函数
function compressImage() {
    // 获取原图信息
    const img = originalImage;
    if (!img.src) return;
    // 创建 Canvas 画布
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    // 绘制原图到画布，PNG 透明部分会变白
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    // 获取压缩比例
    const quality = parseInt(qualityRange.value, 10) / 100;
    // 统一导出为 JPEG
    const mimeType = 'image/jpeg';
    // 压缩图片并导出为 Blob
    canvas.toBlob(function(blob) {
        compressedBlob = blob;
        // 显示压缩后图片预览
        compressedImage.src = URL.createObjectURL(blob);
        // 显示压缩后文件大小
        compressedSize.textContent = formatSize(blob.size);
        // 启用下载按钮
        downloadBtn.disabled = false;
    }, mimeType, quality);
}

// 下载压缩后图片
downloadBtn.addEventListener('click', function() {
    if (!compressedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(compressedBlob);
    a.download = 'compressed-image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// 文件大小格式化函数
function formatSize(size) {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / 1024 / 1024).toFixed(2) + ' MB';
} 