import { objKeyMap, range } from '@genshin-optimizer/common/util'
import type { WeaponKey } from '@genshin-optimizer/gi/consts'
import { allStats } from '@genshin-optimizer/gi/stats'
import { input } from '../../../../Formula'
import { lookup, naught, prod, subscript } from '../../../../Formula/utils'
import { cond, st } from '../../../SheetUtil'
import type { IWeaponSheet } from '../../IWeaponSheet'
import WeaponSheet, { headerTemplate } from '../../WeaponSheet'
import { dataObjForWeaponSheet } from '../../util'

const key: WeaponKey = 'CompoundBow'
const data_gen = allStats.weapon.data[key]

const atk_s = [-1, 0.04, 0.05, 0.06, 0.07, 0.08]
const atkSPD_s = [-1, 0.012, 0.015, 0.018, 0.021, 0.024]
const [condPassivePath, condPassive] = cond(key, 'InfusionArrow')
const atk_ = lookup(
  condPassive,
  {
    ...objKeyMap(range(1, 4), (i) =>
      prod(subscript(input.weapon.refinement, atk_s), i)
    ),
  },
  naught
)
const atkSPD_ = lookup(
  condPassive,
  {
    ...objKeyMap(range(1, 4), (i) =>
      prod(subscript(input.weapon.refinement, atkSPD_s), i)
    ),
  },
  naught
)

const data = dataObjForWeaponSheet(key, data_gen, {
  premod: {
    atk_,
    atkSPD_,
  },
})

const sheet: IWeaponSheet = {
  document: [
    {
      value: condPassive,
      path: condPassivePath,
      header: headerTemplate(key, st('stacks')),
      name: st('hitOp.normalOrCharged'),
      states: Object.fromEntries(
        range(1, 4).map((i) => [
          i,
          {
            name: st('hits', { count: i }),
            fields: [
              {
                node: atk_,
              },
              {
                node: atkSPD_,
              },
            ],
          },
        ])
      ),
    },
  ],
}
export default new WeaponSheet(key, sheet, data_gen, data)
