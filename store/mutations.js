import {
  types
} from "./mutation-types.js"
import {
  state
} from "./state.js"


export function mutations(type, data) {
  switch (type) {
    case types.SET_DISC:
      set_disc(data)
  }

}

function set_disc(disc) {
  state.disc = disc
} 