const setCanvasPreview = (
    image,
    canvas,
    crop
) => {
    const ctx = canvas.getContext('2d');

    if(!ctx) {
        throw new Error('Can\'t set canvas preview image');
    }

    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(pixelRatio * scaleX * crop.width);
    canvas.height = Math.floor(pixelRatio * scaleY * crop.height);

    ctx.scale(pixelRatio, pixelRatio);

    ctx.save();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    );

    ctx.restore();
}

export default setCanvasPreview;