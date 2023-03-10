import useModal from "@/hooks/useModal";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { authService } from "@/firebase";
import useSetReport from "@/hooks/query/reportPost/useSetReport";
import useUpdateReport from "@/hooks/query/reportPost/useUpdateReport";

export interface ReportModalProps {}

const ReportModal = ({ type, post, currentUser, pastPost, reportId }: any) => {
  const { hideModal } = useModal();
  const [cate, setCate] = useState<string>();

  const { isLoading: isLoadingReport, mutate: onSetReport } = useSetReport();

  const { isLoading: isLoadingEditReport, mutate: updateReport } =
    useUpdateReport(reportId || post.id);

  const setReport = async () => {
    if (type === "post") {
      if (authService.currentUser?.uid) {
        if (pastPost.reporter) {
          let copyPost = [...pastPost.reporter];
          copyPost.push({ userId: authService.currentUser?.uid, type: cate });
          await updateReport({
            reportId,
            reportType: "ReportPosts",
            reportObj: {
              reporter: copyPost,
            },
          });
          hideModal();
        } else if (!pastPost.reporter) {
          const newPost = {
            ...post,
            reporter: [{ userId: authService.currentUser?.uid, type: cate }],
          };
          // await setDoc(doc(dbService, "ReportPosts", reportId), newPost);
          onSetReport({
            reportId,
            reportType: "ReportPosts",
            reportObj: newPost,
          });
          hideModal();
        }
      }
    }
    if (type === "comment") {
      if (authService.currentUser?.uid) {
        if (pastPost.reporter) {
          let copyPost = [...pastPost.reporter];
          copyPost.push({
            userId: authService.currentUser?.uid,
            type: cate,
          });
          await updateReport({
            reportId: post.id,
            reportType: "ReportComments",
            reportObj: {
              reporter: copyPost,
            },
          });
          hideModal();
        } else if (!pastPost.reporter) {
          const newComments = {
            commentId: post.id,
            postId: post.postId,
            content: post.content,
            reporter: [{ userId: authService.currentUser?.uid, type: cate }],
          };
          // await setDoc(
          //   doc(dbService, "ReportComments", post.id as string),
          //   newComments
          // );
          onSetReport({
            reportId: post.id,
            reportType: "ReportComments",
            reportObj: newComments,
          });
          hideModal();
        }
      }
    }
    if (type === "recomment") {
      if (authService.currentUser?.uid) {
        if (pastPost.reporter) {
          let copyPost = [...pastPost.reporter];
          copyPost.push({
            userId: authService.currentUser?.uid,
            type: cate,
          });
          await updateReport({
            reportId: post.id,
            reportType: "ReportReComments",
            reportObj: {
              reporter: copyPost,
            },
          });
          hideModal();
        } else if (!pastPost.reporter) {
          const newComments = {
            recommentId: post.id,
            postId: post.commentId,
            content: post.content,
            reporter: [{ userId: authService.currentUser?.uid, type: cate }],
          };
          // await setDoc(
          //   doc(dbService, "ReportReComments", post.id as string),
          //   newComments
          // );
          onSetReport({
            reportId: post.id,
            reportType: "ReportReComments",
            reportObj: newComments,
          });
          hideModal();
        }
      }
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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-[2px]  flex justify-center items-center !m-0 z-10 flex-wrap py-5 overflow-scroll scrollbar-none">
      <div className="w-full relative sm:w-[588px] rounded bg-white z-40 flex flex-col justify-start items-center">
        <button
          aria-label="close"
          className="sm:w-10 w-8 aspect-square absolute top-4 right-5"
          onClick={() => hideModal()}
        >
          <FiX className="w-full h-full text-phGray" />
        </button>
        <div className="sm:text-2xl font-bold my-4 sm:my-7">????????????</div>
        <div className="w-full flex flex-col gap-3 sm:text-sm text-textGray border-y-[1px] border-borderGray py-2 px-5 sm:py-3 sm:px-7">
          <div>
            ?????????
            <span className="text-black ml-3 sm:ml-5">
              {currentUser.nickname}
            </span>
          </div>
          <div>
            ?????????
            <span className="text-black ml-3 sm:ml-5">
              {type === "post" ? post.title : post.content}
            </span>
          </div>
        </div>
        <div className="sm:py-5 sm:px-7 py-3 px-5 w-full">
          <div className="font-bold">????????????</div>
          <div className="w-full border-[1px] mt-3 border-borderGray rounded">
            <label
              onChange={() => setCate("??????????????????")}
              className="flex py-3 px-4 gap-3 border-b-[1px] border-borderGray"
            >
              <input
                type="radio"
                name="report-type"
                value="??????????????????"
                className="hidden peer"
                checked={cate === "??????????????????"}
                readOnly
              />
              {cate === "??????????????????" ? (
                <ImCheckboxChecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#ff6161"
                />
              ) : (
                <ImCheckboxUnchecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#8e8e93"
                />
              )}
              <span>????????????/??????????????????.</span>
            </label>
            <label
              onChange={() => setCate("??????????????????")}
              className="flex py-3 px-4 gap-3 border-b-[1px] border-borderGray"
            >
              <input
                type="radio"
                name="report-type"
                value="??????????????????"
                className="hidden peer"
                checked={cate === "??????????????????"}
                readOnly
              />
              {cate === "??????????????????" ? (
                <ImCheckboxChecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#ff6161"
                />
              ) : (
                <ImCheckboxUnchecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#8e8e93"
                />
              )}
              <span>????????? ????????? ????????????.(??????, ??????, ????????? ?????? ???)</span>
            </label>
            <label
              onChange={() => setCate("?????????")}
              className="flex py-3 px-4 gap-3 border-b-[1px] border-borderGray"
            >
              <input
                type="radio"
                name="report-type"
                value="?????????"
                className="hidden peer"
                checked={cate === "?????????"}
                readOnly
              />
              {cate === "?????????" ? (
                <ImCheckboxChecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#ff6161"
                />
              ) : (
                <ImCheckboxUnchecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#8e8e93"
                />
              )}
              <span>????????? ?????????.</span>
            </label>
            <label
              onChange={() => setCate("????????????")}
              className="flex py-3 px-4 gap-3 border-b-[1px] border-borderGray"
            >
              <input
                type="radio"
                name="report-type"
                value="????????????"
                className="hidden peer"
                checked={cate === "????????????"}
                readOnly
              />
              {cate === "????????????" ? (
                <ImCheckboxChecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#ff6161"
                />
              ) : (
                <ImCheckboxUnchecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#8e8e93"
                />
              )}
              <span>??????????????? ???????????? ????????????.</span>
            </label>
            <label
              onChange={() => setCate("??????????????????")}
              className="flex py-3 px-4 gap-3 border-b-[1px] border-borderGray"
            >
              <input
                type="radio"
                name="report-type"
                value="??????????????????"
                className="hidden peer"
                checked={cate === "??????????????????"}
                readOnly
              />
              {cate === "??????????????????" ? (
                <ImCheckboxChecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#ff6161"
                />
              ) : (
                <ImCheckboxUnchecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#8e8e93"
                />
              )}
              <span>??????????????? ???????????? ????????????.</span>
            </label>
            <label
              onChange={() => setCate("??????")}
              className="flex py-3 px-4 gap-3"
            >
              <input
                type="radio"
                name="report-type"
                value="??????"
                className="hidden peer"
                checked={cate === "??????"}
                readOnly
              />
              {cate === "??????" ? (
                <ImCheckboxChecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#ff6161"
                />
              ) : (
                <ImCheckboxUnchecked
                  className="mt-[2px] cursor-pointer"
                  size="20px"
                  color="#8e8e93"
                />
              )}
              <span>??????</span>
            </label>
          </div>
        </div>
        <button
          aria-label="report"
          onClick={setReport}
          className="w-[280px] mt-2 mb-5 sm:mt-5 sm:mb-10 py-3 h-12 bg-primary text-white font-bold rounded"
        >
          ????????????
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
