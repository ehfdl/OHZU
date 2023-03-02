import React from "react";
import { useRecoilState } from "recoil";
import ConfirmModal from "./confirm_modal";
import AlertModal from "./alert_modal";
import LoginModal from "./login_modal";
import JoinModal from "./join_modal";
import { modalState } from "../recoil/modal";
import ProfileModal from "./profile_modal";
import FollowModal from "./follow_modal";

export const MODAL_TYPES = {
  ConfirmModal: "ConfirmModal",
  AlertModal: "AlertModal",
  LoginModal: "LoginModal",
  JoinModal: "JoinModal",
  ProfileModal: "ProfileModal",
  FollowModal: "FollowModal",
} as const;

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.ConfirmModal]: ConfirmModal,
  [MODAL_TYPES.AlertModal]: AlertModal,
  [MODAL_TYPES.LoginModal]: LoginModal,
  [MODAL_TYPES.JoinModal]: JoinModal,
  [MODAL_TYPES.ProfileModal]: ProfileModal,
  [MODAL_TYPES.FollowModal]: FollowModal,
};

const GlobalModal = () => {
  const { modalType, modalProps } = useRecoilState(modalState)[0] || {};

  const renderComponent = () => {
    if (!modalType) {
      return null;
    }
    const ModalComponent = MODAL_COMPONENTS[modalType];

    return <ModalComponent {...modalProps} />;
  };

  return <>{renderComponent()}</>;
};

export default GlobalModal;
