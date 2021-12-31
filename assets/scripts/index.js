const body = document.querySelector('body');
const hexInput = document.querySelector(`input[name='hexInput']`);
const rgbInput = document.querySelector(`input[name='rgbInput']`);
const hslInput = document.querySelector(`input[name='hslInput']`);
const copyTag = document.querySelector('.copySection .sectionButton');
const themeTag = document.querySelector(`meta[name='theme-color']`);
const msgTag = document.querySelector('.message');
const genButton = document.querySelector('.displaySection .sectionButton');
const hexMode = document.querySelector('input.hexMode');
const rgbMode = document.querySelector('input.rgbMode');
const hslMode = document.querySelector('input.hslMode');
const redSlide = document.querySelector(`input[name='redSlide']`);
const greenSlide = document.querySelector(`input[name='greenSlide']`);
const blueSlide = document.querySelector(`input[name='blueSlide']`);
const redValue = document.querySelector('.label.red .value');
const greenValue = document.querySelector('.label.green .value');
const blueValue = document.querySelector('.label.blue .value');
const display = document.querySelector('.displayColor');

hexInput.addEventListener('input', function (e) {
   inputHandler(isValidHEX, e);
   const data = {
      main: hexInput,
      sub1: rgbInput,
      sub2: hslInput,
      isValid: isValidHEX,
      changer: HEXtoRGBnHSL,
   };
   colorChanger(data);
   slideUpdater();
});

rgbInput.addEventListener('input', function (e) {
   inputHandler(isValidRGB, e);
   const data = {
      main: rgbInput,
      sub1: hexInput,
      sub2: hslInput,
      isValid: isValidRGB,
      changer: RGBtoHEXnHSL,
   };
   colorChanger(data);
   slideUpdater();
});

hslInput.addEventListener('input', function (e) {
   inputHandler(isValidHSL, e);
   const data = {
      main: hslInput,
      sub1: hexInput,
      sub2: rgbInput,
      isValid: isValidHSL,
      changer: HSLtoHEXnRGB,
   };
   colorChanger(data);
   slideUpdater();
});

function inputHandler(isValidFunc, event) {
   let value = event.target.value;
   value = colorTrimmer(value);
   colorValidate(isValidFunc, value);
}

function colorTrimmer(color) {
   color = color.toLowerCase();
   return color.replaceAll(' ', '');
}

function colorValidate(isValidFunc, value) {
   if (isValidFunc(value)) {
      copyTag.disabled = false;
   } else {
      copyTag.disabled = true;
   }
}

copyTag.addEventListener('click', copyHandler);
genButton.addEventListener('click', generateHandler());
redSlide.addEventListener('input', slideHandler);
greenSlide.addEventListener('input', slideHandler);
blueSlide.addEventListener('input', slideHandler);

function copyHandler() {
   let color = hexInput.value;
   if (rgbMode.checked) color = rgbInput.value;
   if (hslMode.checked) color = hslInput.value;
   color = StrBeautify(color);
   navigator.clipboard.writeText(color);
   generateMSG(color);
}

function generateHandler(color) {
   return function () {
      let rgb = genRGBcolor();
      if (color) rgb = color;
      const hex = RGBtoHEX(rgb);
      const hsl = RGBtoHSL(rgb);
      rgbInput.value = StrBeautify(rgb);
      hexInput.value = StrBeautify(hex);
      hslInput.value = StrBeautify(hsl);
      display.style.backgroundColor = rgb;
      themeTag.content = rgb;
      slideUpdater(rgb);
   };
}

generateHandler()();

function genRGBcolor() {
   const rrr = Math.floor(Math.random() * 255);
   const ggg = Math.floor(Math.random() * 255);
   const bbb = Math.floor(Math.random() * 255);
   return `rgb(${rrr},${ggg},${bbb})`;
}

function generateMSG(color) {
   msgTag.innerHTML = `${color} Copied!`;
   msgTag.style.backgroundColor = 'rgb(171, 242, 251)';
   msgTag.style.color = 'black';
   msgTag.classList.add('active');

   setTimeout(function () {
      msgTag.classList.remove('active');
   }, 900);
}

function slideHandler() {
   const red = redSlide.value;
   const green = greenSlide.value;
   const blue = blueSlide.value;
   const rgb = `rgb(${red},${green},${blue})`;
   generateHandler(rgb)();
}

function colorChanger(data) {
   const {main, sub1, sub2} = data;
   const {isValid, changer} = data;
   const value = colorTrimmer(main.value);
   if (isValid(value)) {
      const {color1, color2} = changer(value);
      sub1.value = color1;
      sub2.value = color2;
      display.style.backgroundColor = value;
      themeTag.content = value;
   } else {
      sub1.value = '';
      sub2.value = '';
   }
}

function slideUpdater(color) {
   let rgb = rgbInput.value;
   if (color) rgb = color;
   rgb = colorTrimmer(rgb);
   if (isValidRGB(rgb)) {
      const [red, green, blue] = RGBparser(rgb);
      redValue.innerHTML = red;
      redSlide.value = red;
      greenValue.innerHTML = green;
      greenSlide.value = green;
      blueValue.innerHTML = blue;
      blueSlide.value = blue;
   }
}

function NUMofRGBtoSTRofHEX(color) {
   let [rrr, ggg, bbb] = color;
   let hhh = rrr.toString(16);
   let eee = ggg.toString(16);
   let xxx = bbb.toString(16);
   hhh = hhh.length < 2 ? `0${hhh}` : hhh;
   eee = eee.length < 2 ? `0${eee}` : eee;
   xxx = xxx.length < 2 ? `0${xxx}` : xxx;
   return {hhh, eee, xxx};
}

function HEXofSTRtoNUMofRGB(color) {
   var rrr = (ggg = bbb = 0);
   if (color.length === 3) {
      rrr = color.slice(0, 1) + color.slice(0, 1);
      ggg = color.slice(1, 2) + color.slice(1, 2);
      bbb = color.slice(2, 3) + color.slice(2, 3);
   }
   if (color.length === 6) {
      rrr = color.slice(0, 2);
      ggg = color.slice(2, 4);
      bbb = color.slice(4, 6);
   }
   rrr = parseInt(rrr, 16);
   ggg = parseInt(ggg, 16);
   bbb = parseInt(bbb, 16);
   return {rrr, ggg, bbb};
}

function NUMofRGBtoNUMofHSL(color) {
   let [rrr, ggg, bbb] = color;
   (rrr /= 255), (ggg /= 255), (bbb /= 255);
   var max = Math.max(rrr, ggg, bbb),
      min = Math.min(rrr, ggg, bbb);
   var hhh,
      sss,
      lll = (max + min) / 2;

   if (max == min) {
      hhh = sss = 0;
   } else {
      var d = max - min;
      sss = lll > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
         case rrr:
            hhh = (ggg - bbb) / d + (ggg < bbb ? 6 : 0);
            break;
         case ggg:
            hhh = (bbb - rrr) / d + 2;
            break;
         case bbb:
            hhh = (rrr - ggg) / d + 4;
            break;
      }
      hhh /= 6;
   }

   hhh = (hhh * 360).toFixed(0);
   sss = (sss * 100).toFixed(0);
   lll = (lll * 100).toFixed(0);
   return {hhh, sss, lll};
}

function NUMofHSLtoNUMofRGB(color) {
   let [hhh, sss, lll] = color;
   (hhh /= 360), (sss /= 100), (lll /= 100);
   var rrr, ggg, bbb;

   if (sss == 0) {
      rrr = ggg = bbb = lll;
   } else {
      var q = lll < 0.5 ? lll * (1 + sss) : lll + sss - lll * sss;
      var p = 2 * lll - q;
      rrr = hue2rgb(p, q, hhh + 1 / 3);
      ggg = hue2rgb(p, q, hhh);
      bbb = hue2rgb(p, q, hhh - 1 / 3);

      function hue2rgb(p, q, t) {
         if (t < 0) t += 1;
         if (t > 1) t -= 1;
         if (t < 1 / 6) return p + (q - p) * 6 * t;
         if (t < 1 / 2) return q;
         if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
         return p;
      }
   }

   rrr = Math.floor(rrr * 255);
   ggg = Math.floor(ggg * 255);
   bbb = Math.floor(bbb * 255);
   return {rrr, ggg, bbb};
}

function HEXtoRGB(color) {
   color = HEXparser(color);
   let {rrr, ggg, bbb} = HEXofSTRtoNUMofRGB(color);
   return `rgb(${rrr},${ggg},${bbb})`;
}

function RGBtoHEX(color) {
   color = RGBparser(color);
   const {hhh, eee, xxx} = NUMofRGBtoSTRofHEX(color);
   return `#${hhh}${eee}${xxx}`;
}

function HSLtoRGB(color) {
   color = HSLparser(color);
   let {rrr, ggg, bbb} = NUMofHSLtoNUMofRGB(color);
   return `rgb(${rrr},${ggg},${bbb})`;
}

function RGBtoHSL(color) {
   color = RGBparser(color);
   const {hhh, sss, lll} = NUMofRGBtoNUMofHSL(color);
   return `hsl(${hhh},${sss}%,${lll}%)`;
}

function HEXtoRGBnHSL(color) {
   const color1 = StrBeautify(HEXtoRGB(color));
   const color2 = StrBeautify(RGBtoHSL(color1));
   return {color1, color2};
}

function RGBtoHEXnHSL(color) {
   const color1 = StrBeautify(RGBtoHEX(color));
   const color2 = StrBeautify(RGBtoHSL(color));
   return {color1, color2};
}

function HSLtoHEXnRGB(color) {
   const color2 = StrBeautify(HSLtoRGB(color));
   const color1 = StrBeautify(RGBtoHEX(color2));
   return {color1, color2};
}

function StrBeautify(value) {
   value = value.replaceAll(' ', '');
   value = value.toLowerCase();
   return value.replaceAll(',', ', ');
}

function HEXparser(color) {
   return color.replaceAll(/[#\(\) ]/g, '');
}

function RGBparser(color) {
   color = color.replaceAll(/[rgb\(\) ]/g, '');
   color = color.split(',');
   return color.map(v => Number(v));
}

function HSLparser(color) {
   color = color.replaceAll(/[hsl\(\)% ]/g, '');
   color = color.split(',');
   return color.map(v => Number(v));
}

function isValidHEX(color) {
   return /^#([0-9a-f]{6}|[0-9a-f]{3})$/.test(color);
}

function isValidRGB(color) {
   return /^rgb\((([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\,([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\,([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\))$/.test(
      color
   );
}

function isValidHSL(color) {
   return /^hsl\((([0-9]|[0-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9]|360)\,([0-9]|[0-9][0-9]|100)%\,([0-9]|[0-9][0-9]|100)%\))$/.test(
      color
   );
}
