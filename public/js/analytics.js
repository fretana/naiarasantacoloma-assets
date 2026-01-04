window.qxTrack = function (event, data = {}) {
  if (!window.dataLayer) return;

  window.dataLayer.push({
    event,
    ...data,
  });
};
