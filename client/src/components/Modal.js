import React from "react";
import ColorRoundButton from "../components/ColorRoundButton";

export default function Modal({ showModal, setShowModal }) {
  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            // onClick={() => setShowModal(false)}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">Settings</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto overflow-y-scroll" style={{maxHeight: '20rem'}}>
                  {/* <p className="my-4 text-gray-600 text-lg leading-relaxed">
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can’t do anything, you
                    won’t do anything. I was taught I could do everything.
                  </p> */}

                  <h2 className="text-2xl font-semibold">Account Details</h2>
                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Google account:</h2>
                    </div>
                    <div className="ml-8">
                      <h2>harris7001@gmail.com</h2>
                    </div>
                  </div>

                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Spotify account:</h2>
                    </div>
                    <div className="ml-8">
                      <h2>harry0446@gmail.com</h2>
                    </div>
                  </div>

                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Delete account:</h2>
                    </div>
                    <div className="ml-8">
                      <ColorRoundButton
                        text="Delete"
                        textColor="white"
                        colorA="red-500"
                        colorB="red-700"
                        otherClasses="mt-1 sm:mt-0 py-2 px-4"
                        href="#"
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold">Calendar Details</h2>
                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Calendar last updated:</h2>
                    </div>
                    <div className="ml-8">
                      <h2>2 days ago</h2>
                    </div>
                  </div>

                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Refresh calendar:</h2>
                    </div>
                    <div className="ml-8">
                      <ColorRoundButton
                        text="Refresh"
                        textColor="white"
                        colorA="brandBlue-A"
                        colorB="brandBlue-B"
                        otherClasses="mt-1 sm:mt-0 py-2 px-4"
                        href="#"
                      />
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
