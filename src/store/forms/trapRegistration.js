import { timeParse } from 'd3-time-format'

const blankForm = () => ({
  season: null,
  adm_1: null,
  adm_2: null,
  adm_3: null,
  adm_4: null,
  longitude: null,
  latitude: null,
  crop: null,
  tag: null,
  installationDate: null,
  farmerName: '',
  farmerPhone: '',
  farmerPhoneUser: null,
  farmerAddress: '',
  farmerLandOwner: true,
  landOwnerName: '',
  landOwnerPhone: '',
  landOwnerAddress: ''
})

const compute = form => {
  let area = {}
  if (form.adm_1) area = { ...area, ...form.adm_1 }
  if (form.adm_2) area = { ...area, ...form.adm_2 }
  if (form.adm_3) area = { ...area, ...form.adm_3 }
  if (form.adm_4) area = { ...area, ...form.adm_4 }

  return {
    season: !form.season ? null : form.season._id,
    country: !form.season ? null : form.season.country,
    area,
    longitude: form.longitude,
    latitude: form.latitude,
    crop: !form.crop ? null : form.crop,
    tag: form.tag,
    installationDate: !form.installationDate ? null : timeParse('%Y-%m-%d %H:%M:%S')(form.installationDate).toISOString(),
    farmer: {
      name: form.farmerName,
      phone: form.farmerPhone,
      phoneUser: form.farmerPhoneUser,
      address: form.farmerAddress,
      landOwner: form.farmerLandOwner
    },
    landOwner: {
      name: form.farmerLandOwner ? form.farmerName : form.landOwnerName,
      phone: form.farmerLandOwner ? form.farmerPhone : form.landOwnerPhone,
      address: form.farmerLandOwner ? form.farmerAddress : form.landOwnerAddress
    }
  }
}

export { blankForm, compute }
