export const getColorByBaiFenBi = (bili) => {
    // console.log(bili,'bill');
    let r = 0;
    let g = 0;
    let b = 0;
    if (bili < 0.5) {
      r = 94 * bili + 125;
      g = 38 * bili + 190;
      b = 236 - bili * 9;
    }

    if (bili >= 0.5) {
      r = 254 - bili * 17;
      g = 234 - bili * 137;
      b = 215 - bili * 146;
    }
    r = parseInt(r); // 取整
    g = parseInt(g); // 取整
    b = parseInt(b); // 取整
    return "rgb(" + r + "," + g + "," + b + ")";
  };