import ModalComponent from "@/components/modal-component";

export default function ConfirmModal(values: {
  show: boolean;
  onHide: any;
  text: string;
  subText: string;
  callback: any;
  style: string;
}) {
  const content = () => {
    return (
      <>
        <div className=" flex flex-col gap-2 xs:w-ct360 md:w-ct480 md:gap-5">
          {values.text && (
            <div className="flex items-center justify-start">
              <h1 className="text-xl md:text-3xl">{values.text}</h1>
            </div>
          )}
          <div className="mb-4 flex items-center justify-start">
            <h2 className="md:text-xl">{values.subText}</h2>
          </div>
          <div className="flex justify-end gap-5">
            <button
              className="h-10 w-full rounded-5 border border-ctGray bg-white disabled:opacity-75 xs:w-ct120 md:h-ct50 md:text-base"
              onClick={(e) => {
                e.preventDefault();
                values.onHide();
              }}
            >
              ยกเลิก
            </button>
            <button
              className={values.style}
              onClick={() => {
                values.onHide();
                values.callback();
              }}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <ModalComponent
      show={values.show}
      onHide={() => {
        values.onHide();
      }}
      content={content}
    />
  );
}
