import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import useModal from "@/hooks/useModal";

export interface DeleteAccountModalProps {}

const DeleteAccountModal = ({}: DeleteAccountModalProps) => {
  const [form, setForm] = useState({ check: false, pw: "" });
  const [valiCheck, setValiCheck] = useState("");
  const [valiPw, setValiPw] = useState("");

  const { hideModal } = useModal();

  const onChangeCheck = () => {
    setForm({ ...form, check: !form.check });
    if (!form.check) {
      setValiCheck("");
    }
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValiPw("");
    const { name, value } = event.target;
    setForm((prev: any) => {
      return { ...prev, [name]: value };
    });
  };

  const validateForm = () => {
    if (!form.check) {
      setValiCheck("약관에 동의해주세요.");
      return;
    }
    if (!form.pw) {
      setValiPw("비밀번호를 입력해주세요.");
      return;
    }
    // if (form.pw !== "") {        "" 안에 유저 비밀번호 넣으면 됨.
    //     setValiPw("비밀번호가 틀렸습니다.");
    //     return;
    //   }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    validateForm();
    //     if(form.pw === "비밀번호랑 같다면" ){
    //         회원탈퇴
    // hideModal();

    //     }
  };

  useEffect(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px] flex justify-center items-center flex-wrap sm:py-10 !m-0 z-10 overflow-scroll scrollbar-none">
      <div className="w-full h-full sm:h-auto relative sm:w-[588px] p-6 sm:p-9 bg-white z-40 flex flex-col justify-start items-center rounded overflow-scroll scrollbar-none">
        <button
          aria-label="close"
          className="w-9 sm:w-10 aspect-square absolute top-7 right-7"
          onClick={() => hideModal()}
        >
          <FiX className="w-full h-full text-phGray" />
        </button>
        <div className="text-[18px] sm:text-[32px] font-bold mt-3 sm:mt-10 ">
          회원 탈퇴
        </div>
        <div className="sm:mt-16 mt-10 flex flex-col gap-4">
          <div className="flex gap-2  font-bold ">
            <Image
              src="/image/exclamation_circle.svg"
              alt="exclamation_circle"
              width={24}
              height={24}
            />
            <div className="pt-[1px]">탈퇴 시 유의사항 안내</div>
          </div>
          <ol className=" list-decimal pl-7 pr-3 sm:pr-0 sm:pl-4 l text-[12px] leading-6 sm:text-[14px] text-textGray">
            <li> 회원 탈퇴 시 즉시 탈퇴 처리되며 서비스 이용이 불가합니다.</li>
            <li>
              기존 작성한 게시물과 댓글은 자동으로 삭제되며, 재가입 시 복구되지
              않습니다.
            </li>
            <li> 적립 포인트는 모두 소멸되며 재가입 시 복구되지 않습니다.</li>
            <li>
              회원 정보는 회원 탈퇴 즉시 삭제됩니다. 다만, 부정 이용 거래 방지
              및 전자상거래법 등 관련 법령에 따라 보관이 필요한 경우 해당
              기간동안 회원 정보가 보관됩니다.
            </li>
          </ol>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.check}
              onChange={onChangeCheck}
            />
            <span className="ml-3 mt-[2px] text-sm sm:text-base text-textGray">
              위 내용을 모두 확인했습니다.{" "}
              <span className="text-xs sm:text-sm text-[red]">{valiCheck}</span>
            </span>
          </label>
        </div>
        <div className="w-full mt-6 font-bold">
          비밀번호
          <span className="pl-2 font-normal text-xs sm:text-sm text-[red]">
            {valiPw}
          </span>
        </div>
        <input
          name="pw"
          type="password"
          value={form.pw}
          onChange={onChangePassword}
          placeholder="비밀번호를 입력해주세요."
          className="w-full sm:text-base text-[14px] h-11 mt-2 bg-[#f5f5f5] px-4"
        />

        <button
          aria-label="save"
          onClick={onSubmit}
          className="w-full rounded sm:w-[280px]  bg-primary text-white my-12 sm:my-9 py-4"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
