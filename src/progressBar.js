import * as PIXI from 'pixi.js';

export default (function() {
  const DFT_SETTING = {
    x: 50,
    y: 300,
    width: 700,
    height: 4,
    progressBgColor: 0xffffff,
    progressColor: 0xff3300,
    bgColor: 0x000000,
  };
  const DELAY_INIT = 50;
  const DELAY_INC = 100;
  const DELAY_DISAPPEAR = 250;

  const drawProgress = function(currentProgress, barGraphic, settings) {
    const localSettings = Object.assign(settings || {}, DFT_SETTING);
    //
    barGraphic.lineStyle(0, localSettings.progressBgColor, 1);
    barGraphic.beginFill(localSettings.progressBgColor, 1);
    barGraphic.drawRect(
      localSettings.x,
      localSettings.y,
      localSettings.width,
      localSettings.height
    );
    //
    barGraphic.lineStyle(0, localSettings.progressColor, 1);
    barGraphic.beginFill(localSettings.progressColor, 1);
    barGraphic.drawRect(
      localSettings.x,
      localSettings.y,
      localSettings.width * (currentProgress / 100),
      localSettings.height
    );
  };
  const drawBackground = function(bgGraphic, container) {
    bgGraphic.lineStyle(0, DFT_SETTING.bgColor, 1);
    bgGraphic.beginFill(DFT_SETTING.bgColor, 1);
    bgGraphic.drawRect(
      container.x,
      container.y,
      container.width,
      container.height
    );
  };
  //
  const pub = {};
  pub.log = function(loader) {
    loader.onProgress.add(e => {
      console.log(e.progress);
    });
  };
  pub.barAsync = function(loader, container, settings) {
    const barContainer = new PIXI.Container();
    const bgGraphic = new PIXI.Graphics();
    const barGraphic = new PIXI.Graphics();
    let delay = DELAY_INIT;
    //
    barContainer.addChild(bgGraphic);
    barContainer.addChild(barGraphic);
    container.addChild(barContainer);
    //
    loader.onProgress.add(e => {
      (function(p) {
        delay += DELAY_INC;
        setTimeout(() => {
          container.setChildIndex(barContainer, container.children.length - 1);
          drawBackground(bgGraphic, container);
          drawProgress(p, barGraphic, settings);
        }, delay);
      })(e.progress);
    });
    loader.onComplete.add(() => {
      delay += DELAY_DISAPPEAR;
      setTimeout(() => {
        container.removeChild(barContainer);
      }, delay);
    });
  };
  return pub;
})();
