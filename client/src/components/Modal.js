import React, { useState } from "react";
import ColorRoundButton from "../components/ColorRoundButton";
import { deleteUser } from "../api";

export default function Modal({ showModal, setShowModal, userDetails }) {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
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
                <div
                  className="relative p-6 flex-auto overflow-y-scroll"
                  style={{ maxHeight: "20rem" }}
                >
                  <h2 className="text-2xl font-semibold">Account Details</h2>
                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Google account:</h2>
                    </div>
                    <div className="ml-8">
                      <h2>{userDetails.google_email}</h2>
                    </div>
                  </div>

                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Spotify account:</h2>
                    </div>
                    <div className="ml-8">
                      <h2>{userDetails.spotify_email}</h2>
                    </div>
                  </div>

                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Delete account:</h2>
                    </div>
                    <div className="ml-8">
                      <ColorRoundButton
                        text={showDeleteButton ? "Cancel" : "Delete"}
                        textColor="white"
                        colorA="red-500"
                        colorB="red-700"
                        otherClasses="mt-1 sm:mt-0 py-2 px-4 cursor-pointer"
                        onClick={() => setShowDeleteButton(!showDeleteButton)}
                      />
                    </div>
                  </div>
                  {showDeleteButton ? (
                    <ColorRoundButton
                      text={"Delete Account"}
                      textColor="white"
                      colorA="red-500"
                      colorB="red-700"
                      otherClasses="my-2 py-2 px-4 cursor-pointer block text-center"
                      onClick={() =>
                        deleteUser()
                          .then((json) => {
                            if (json.error) throw new Error();
                            alert("Your account has been deleted.");
                            window.location.reload();
                          })
                          .catch(() =>
                            alert(
                              "Your account couldn't be deleted, please try again."
                            )
                          )
                      }
                    />
                  ) : null}
                  <h2 className="text-2xl font-semibold">Calendar Details</h2>
                  <div className="flex items-center justify-between my-6">
                    <div>
                      <h2>Calendar last updated:</h2>
                    </div>
                    <div className="ml-8">
                      <h2>
                        {userDetails.calendar_last_updated === ""
                          ? "N/A"
                          : timeSince(
                              new Date(
                                parseInt(userDetails.calendar_last_updated)
                              )
                            ) + " ago"}
                      </h2>
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
