import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { storageService } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import useUpdateUser from "@/hooks/query/user/useUpdateUser";

export interface ProfileModalProps {
  myProfile?: any;
}

const ProfileModal = ({ myProfile }: ProfileModalProps) => {
  const [form, setForm] = useState(myProfile);
  const [imgFile, setImgFile] = useState<File | null>();

  const [preview, setPreview] = useState<string | null>();

  const [validateNickName, setValidateNickName] = useState("");

  const { showModal, hideModal } = useModal();

  const onChangeValue = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev: any) => {
      return { ...prev, [name]: value };
    });
  };

  const onChangeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setImgFile(file);
      }
    }
  };

  const validateChangeNickName = () => {
    if (form.nickname!.length > 5) {
      setValidateNickName("닉네임을 5자 이하로 입력해 주세요.");
    } else if (form.nickname!.length <= 5) {
      setValidateNickName("");
    }
  };

  const { isLoading: isLoadingEditUser, mutate: updateUser } = useUpdateUser(
    myProfile.userId
  );

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let imgFileUrl = "";
    if (validateNickName === "") {
      if (preview !== null) {
        const previewRef = ref(storageService, `profile/${uuidv4()}`);
        await uploadString(previewRef, preview as string, "data_url");
        imgFileUrl = await getDownloadURL(previewRef);
        let newForm = {
          ...form,
          imageURL: imgFileUrl,
        };
        updateUser({
          userId: myProfile.userId,
          editUserObj: newForm,
        });
      } else {
        updateUser({
          userId: myProfile.userId,
          editUserObj: form,
        });
      }

      hideModal();
    }
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

  useEffect(() => {
    if (imgFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(imgFile);
    } else {
      setPreview(null);
    }
  }, [imgFile]);

  useEffect(() => {
    validateChangeNickName();
  }, [form]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px] flex justify-center items-center sm:py-10 !m-0 z-10 flex-wrap overflow-scroll scrollbar-none">
      <div className="w-full relative max-w-[390px] sm:max-w-[588px] pt-4 pb-10 sm:py-20 bg-white z-40 flex flex-col justify-start items-center rounded">
        <button
          aria-label="close"
          className="w-9  sm:w-10 aspect-square absolute top-7 right-7"
          onClick={() => hideModal()}
        >
          <FiX className="w-full h-full text-phGray" />
        </button>

        <div className="text-[18px] sm:text-[32px] font-bold mt-6 ">
          프로필 설정
        </div>
        <div className="w-[120px] sm:w-40 aspect-square mt-12 sm:mt-6 bg-[#d9d9d9] rounded-full ">
          {preview !== null
            ? preview && (
                <Image
                  src={preview as string}
                  className="w-[120px] sm:w-40 aspect-square object-cover rounded-full"
                  width={120}
                  height={120}
                  alt=""
                />
              )
            : myProfile.imageURL && (
                <Image
                  src={myProfile.imageURL as string}
                  className="w-[120px] sm:w-40 aspect-square object-cover rounded-full "
                  width={120}
                  height={120}
                  alt=""
                />
              )}
        </div>
        <label className="mt-4 sm:mt-[30px] cursor-pointer rounded-full ">
          <input
            onChange={onChangeImg}
            name="img"
            type="file"
            accept="image/*"
            className="hidden"
          />
          <div className="text-[12px] sm:text-base">프로필 이미지 수정</div>
        </label>
        <div className="w-[342px] mt-[30px] sm:w-[472px] sm:mt-3">
          <div>
            <span className="font-bold sm:text-[24px]">닉네임</span>
            <span className="ml-2 text-[11px] sm:text-sm text-[red]  w-full">
              {validateNickName}
            </span>
          </div>
          <input
            name="nickname"
            value={form.nickname}
            onChange={onChangeValue}
            className="w-full sm:text-base text-[14px] h-11 mt-2 bg-[#f5f5f5] px-4"
          />
          <div className="font-bold sm:text-[24px] mt-6 sm:mt-9">소개</div>
          <textarea
            name="introduce"
            value={form.introduce}
            onChange={onChangeValue}
            className="w-full sm:text-base text-[14px] min-h-[132px] mt-2 bg-[#f5f5f5] py-2 px-4 resize-none"
          />

          <button
            className="w-full mt-7 text-right text-textGray"
            onClick={() => {
              showModal({ modalType: "DeleteAccountModal", modalProps: {} });
            }}
          >
            회원탈퇴
          </button>
        </div>
        <button
          aria-label="save"
          onClick={onSubmit}
          className="w-[344px] sm:w-[280px]  bg-primary text-white mt-4 py-3"
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
