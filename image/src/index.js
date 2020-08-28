const columns = [
  ...document.querySelectorAll(".js-calendar-graph > svg > g > g"),
].map((col) => [...col.querySelectorAll("rect")]);

const img = new Image();
img.src = "/image/adarsh-headshot.jpg";
img.onload = () => {
  const cvs = document.createElement("canvas");
  const ctx = cvs.getContext("2d");
  ctx.drawImage(img, 0, 0);

  let offset = 0;
  window.setInterval(() => {
    columns.forEach((cols, cx) => {
      cols.forEach((rect, cy) => {
        const pxlData = ctx.getImageData(cx, cy + offset, 1, 1);
        rect.style.fill = `rgba(${pxlData.data.join(",")})`;
      });
    });
    offset += 1;
    if (offset + 7 > img.height) {
      offset = 0;
    }
  }, 100);
};
