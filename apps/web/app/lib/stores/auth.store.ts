import { BehaviorSubject } from "rxjs"
import type { UserSession } from "@homework/types/user.interface"

const authSubject = new BehaviorSubject<UserSession | null>(null)

export const authStore = {
  subject: authSubject,
  get state() {
    return authSubject.getValue()
  },
  set(session: UserSession | null) {
    authSubject.next(session)
  },
  clear() {
    authSubject.next(null)
  },
}
