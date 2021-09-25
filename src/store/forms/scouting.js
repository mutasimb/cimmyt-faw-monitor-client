const blankForm = () => ({
  season: null,
  crop: null,
  area: null,
  trap: null,
  longitude: null,
  latitude: null,
  moth: null,
  stage: null,
  sfw: null,
  iw: null,
  cob: null
})

const compute = form => {
  const returnable = {
    season: !form.season ? null : form.season._id,
    country: !form.season ? null : form.season.country,
    crop: form.crop,
    trap: form.trap,
    longitude: form.longitude,
    latitude: form.latitude,
    moth: form.moth,
    stage: form.stage,
    sfw: form.sfw,
    iw: form.iw
  }
  if (form.cob || form.cob === 0) returnable.cob = form.cob

  const area = !form.area ? {}
    : form.area.level === 3 ? { adm1: form.area.parentId[0], adm2: form.area.parentId[1], adm3: form.area._id }
      : { adm1: form.area.parentId[0], adm2: form.area.parentId[1], adm3: form.area.parentId[2], adm4: form.area._id }

  return { ...returnable, ...area }
}

export { blankForm, compute }
