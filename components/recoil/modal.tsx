import { atom } from "recoil";
import { MODAL_TYPES } from "../modal/global_modal";
import { ConfirmModalProps } from "../modal/confirm_modal";
import { AlertModalProps } from "../modal/alert_modal";
import { LoginModalProps } from "../modal/login_modal";
import { JoinModalProps } from "../modal/join_modal";
import { ProfileModalProps } from "../modal/profile_modal";
import { DeleteAccountModalProps } from "../modal/delete_account_modal";
import { ReportModalProps } from "../modal/report_modal";

const {
  ConfirmModal,
  AlertModal,
  LoginModal,
  JoinModal,
  ProfileModal,
  DeleteAccountModal,
  ReportModal,
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

export interface ReportModalType {
  modalType: typeof ReportModal;
  modalProps: ReportModalProps;
}

export interface DeleteAccountModalType {
  modalType: typeof DeleteAccountModal;
  modalProps: DeleteAccountModalProps;
}

export type ModalType =
  | ConfirmModalType
  | AlertModalType
  | LoginModalType
  | JoinModalType
  | ProfileModalType
  | ReportModalType
  | DeleteAccountModalType;

export const modalState = atom<ModalType | null>({
  key: "modalState",
  default: null,
});
