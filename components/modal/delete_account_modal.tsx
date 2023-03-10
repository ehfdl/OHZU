import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import useDeletePost from "@/hooks/query/post/useDeletePost";
import { authService, dbService, storageService } from "@/firebase";
import { deleteUser, signOut } from "firebase/auth";
import { BEER_IMG, ETC_IMG, LIQUOR_IMG, SOJU_IMG } from "@/util";
import { deleteObject, ref } from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";

export interface DeleteAccountModalProps {
  myPosts?: any;
}

const DeleteAccountModal = ({ myPosts }: DeleteAccountModalProps) => {
  const router = useRouter();
  const [valiCheck, setValiCheck] = useState(false);

  const { hideModal } = useModal();

  const onChangeCheck = () => {
    if (!valiCheck) {
      setValiCheck(true);
    } else {
      setValiCheck(false);
    }
  };

  const deleteAll = async () => {
    if (myPosts) {
      myPosts.map(async (item: any) => {
        if (item && authService.currentUser?.uid) {
          const commentQuery = query(
            collection(dbService, "Comments"),
            where("postId", "==", item.postId)
          );
          const myCommentQuery = query(
            collection(dbService, "Comments"),
            where("userId", "==", authService.currentUser?.uid)
          );

          const commentQuerySnapShot = await getDocs(commentQuery);
          const myCommentQuerySnapShot = await getDocs(myCommentQuery);

          const recommentQuery = query(
            collection(dbService, "Recomments"),
            where("postId", "==", item.postId)
          );
          const myRecommentQuery = query(
            collection(dbService, "Recomments"),
            where("userId", "==", authService.currentUser?.uid)
          );

          const recommentQuerySnapShot = await getDocs(recommentQuery);
          const myRecommentQuerySnapShot = await getDocs(myRecommentQuery);

          if (
            commentQuerySnapShot !== null ||
            commentQuerySnapShot !== undefined
          ) {
            const newComment: any = [];
            commentQuerySnapShot.forEach((doc) => {
              const newCommentObj = {
                id: doc.id,
                ...doc.data(),
              };
              newComment.push(newCommentObj.id);
            });

            newComment.map(async (id: string) => {
              await deleteDoc(doc(dbService, "Comments", id as string));
            });
          }
          if (
            myCommentQuerySnapShot !== null ||
            myCommentQuerySnapShot !== undefined
          ) {
            const newComment: any = [];
            myCommentQuerySnapShot.forEach((doc) => {
              const newCommentObj = {
                id: doc.id,
                ...doc.data(),
              };
              newComment.push(newCommentObj.id);
            });

            newComment.map(async (id: string) => {
              await deleteDoc(doc(dbService, "Comments", id as string));
            });
          }

          if (
            recommentQuerySnapShot !== null ||
            recommentQuerySnapShot !== undefined
          ) {
            const newRecomment: any = [];
            recommentQuerySnapShot.forEach((doc) => {
              const newObj = {
                id: doc.id,
                ...doc.data(),
              };
              newRecomment.push(newObj.id);
            });

            newRecomment.map(async (id: string) => {
              await deleteDoc(doc(dbService, "Recomments", id as string));
            });
          }

          if (
            myRecommentQuerySnapShot !== null ||
            myRecommentQuerySnapShot !== undefined
          ) {
            const newRecomment: any = [];
            myRecommentQuerySnapShot.forEach((doc) => {
              const newObj = {
                id: doc.id,
                ...doc.data(),
              };
              newRecomment.push(newObj.id);
            });

            newRecomment.map(async (id: string) => {
              await deleteDoc(doc(dbService, "Recomments", id as string));
            });
          }

          // Delete Image
          const postImgId = item?.img?.map((item: string) => {
            if (
              item !== SOJU_IMG &&
              item !== BEER_IMG &&
              item !== LIQUOR_IMG &&
              item !== ETC_IMG
            ) {
              return item.split("2F")[1].split("?")[0];
            } else {
              return null;
            }
          });

          postImgId?.map(async (item: string | null) => {
            if (item !== null && item !== undefined) {
              const desertRef = ref(storageService, `post/${item}`);

              await deleteObject(desertRef)
                .then(() => {
                  // File deleted successfully
                })
                .catch((error) => {
                  console.log("error", error);
                  // Uh-oh, an error occurred!
                });
            }
          });
        }
        await deleteDoc(doc(dbService, "Posts", item.postId));
      });
    }
    await deleteDoc(
      doc(dbService, "Users", authService.currentUser?.uid as string)
    );
    console.log("완료");
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (authService.currentUser?.uid) {
      deleteAll();

      deleteUser(authService.currentUser)
        .then(() => {
          console.log("authService.currentUser : ", authService.currentUser);
          sessionStorage.clear();
        })
        .catch((error) => {
          console.log(
            "Error : ",
            error,
            "authService.CurrentUser",
            authService.currentUser
          );
        });
      hideModal();
      router.push("/");
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
          <div className="flex gap-2  font-semibold ">
            <Image
              src="/image/exclamation_circle.svg"
              alt="exclamation_circle"
              width={24}
              height={24}
            />
            <div className="mt-1">탈퇴 시 유의사항 안내</div>
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
              및 전자상거래법 등 <br />
              관련 법령에 따라 보관이 필요한 경우 해당 기간동안 회원 정보가
              보관됩니다.
            </li>
          </ol>
          <div className="flex">
            <label className="items-center mt-5 mb-20">
              <input type="checkbox" onChange={onChangeCheck} />
              <span className="ml-2 mt-[2px] text-sm sm:text-base text-textGray">
                위 내용을 모두 확인했습니다.
              </span>
            </label>
          </div>
        </div>

        <button
          aria-label="save"
          onClick={onSubmit}
          className="w-full rounded sm:w-[280px]  bg-primary disabled:bg-[#aaa] text-white my-12 sm:my-9 py-4"
          disabled={!valiCheck}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
