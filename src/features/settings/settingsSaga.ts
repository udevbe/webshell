import { call, fork, put, select, takeLatest } from 'redux-saga/effects'
import { CompositorSession, nrmlvo } from '../../../../greenfield/compositor-module'
import { PayloadActionFromCreator } from '../type-utils'
import { configureKeymap, selectActiveKeymap, setKeymaps, settingsDone } from './settingsSlice'

function* handleConfigureKeymap(session: CompositorSession, action: PayloadActionFromCreator<typeof configureKeymap>) {
  session.userShell.actions.setUserConfiguration({ keyboardLayoutName: action.payload.keymap.name })
}

function* watchConfigureKeymap(session: CompositorSession) {
  yield takeLatest(configureKeymap.type, handleConfigureKeymap, session)
}

function* initKeymaps(session: CompositorSession) {
  const keymaps = session.globals.seat.keyboard.nrmlvoEntries
  yield put(setKeymaps({ keymaps }))

  const keymap = ((yield select(selectActiveKeymap)) as nrmlvo | undefined) ?? session.globals.seat.keyboard.nrmlvo
  yield put(configureKeymap({ keymap }))
}

function* done() {
  yield put(settingsDone())
}

export function* settingsSaga(session: CompositorSession): any {
  yield fork(watchConfigureKeymap, session)
  yield call(initKeymaps, session)
  yield call(done)
}
