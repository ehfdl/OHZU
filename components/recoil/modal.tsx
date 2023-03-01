import { atom } from "recoil";
import { MODAL_TYPES } from "../modal/global_modal";
import { ConfirmModalProps } from "../modal/confirm_modal";
import { AlertModalProps } from "../modal/alert_modal";
import { LoginModalProps } from "../modal/login_modal";
import { JoinModalProps } from "../modal/join_modal";
import { ProfileModalProps } from "../modal/profile_modal";
import { FollowModalProps } from "../modal/follow_modal";

const {
  ConfirmModal,
  AlertModal,
  LoginModal,
  JoinModal,
  ProfileModal,
  FollowModal,
} = MODAL_TYPES;

export interface ConfirmModalType {
  modalType: typeof ConfirmModal;
  modalProps: ConfirmModalProps;
}

export interface AlertModalType {
  modalType: typeof AlertModal;
  modalProps: AlertModalProps;
}

export interface LoginModalType {
  modalType: typeof LoginModal;
  modalProps: LoginModalProps;
}

export interface JoinModalType {
  modalType: typeof JoinModal;
  modalProps: JoinModalProps;
}

export interface ProfileModalType {
  modalType: typeof ProfileModal;
  modalProps: ProfileModalProps;
}

export interface FollowModalType {
  modalType: typeof FollowModal;
  modalProps: FollowModalProps;
}

export type ModalType =
  | ConfirmModalType
  | AlertModalType
  | LoginModalType
  | JoinModalType
  | ProfileModalType
  | FollowModalType;

export const modalState = atom<ModalType | null>({
  key: "modalState",
  default: null,
});
