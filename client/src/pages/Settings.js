import React from "react";
import NavBar from "../components/NavBar";
import ColorRoundButton from "../components/ColorRoundButton";
import Link from "../components/Link";

export default function Settings() {
  return (
    <>
      <NavBar>
        <Link
          otherClasses=""
          href="#howtouse"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="How do I use it?"
        />
        <Link
          otherClasses="mt-1 sm:mt-0 sm:ml-2"
          href="#"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="About Us"
        />
        <Link
          otherClasses="mt-1 sm:mt-0 sm:ml-2 sm:mr-2"
          href="#"
          color="gray-500"
          hoverColor="gray-900"
          focusColor="gray-900"
          text="Something"
        />
        <ColorRoundButton
          text="Try it now!"
          textColor="white"
          colorA="brandBlue-A"
          colorB="brandBlue-B"
          otherClasses="mt-1 sm:mt-0 py-2 px-4"
        />
      </NavBar>
      <div className="sm:py-24 py-6 px-4 md:w-1/3 mx-auto">
        {/* <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
          scelerisque diam felis, id vestibulum orci fringilla eget. Cras a erat
          risus. Ut imperdiet orci ante, sed ullamcorper elit scelerisque nec.
          Quisque pellentesque ullamcorper nibh eu blandit. Aliquam fringilla
          sagittis accumsan. Phasellus porta feugiat urna quis accumsan. Donec
          eget nibh tortor. Nam aliquet at libero semper ullamcorper. Nam id
          vestibulum purus, at fermentum orci. Suspendisse at dictum mi, non
          accumsan felis. Curabitur interdum tellus eu turpis consectetur
          tempor. Aenean eget turpis eget magna sollicitudin scelerisque vitae
          nec velit. Nam accumsan, urna sed sodales luctus, nibh sem iaculis
          nibh, vel iaculis erat lorem vel turpis. Duis nec mollis nunc. Integer
          eget dui ac odio tristique maximus et vel odio. Donec condimentum
          pellentesque consectetur. Aliquam ultrices ac velit quis interdum.
          Nunc iaculis diam ac erat mattis, eget dignissim lacus finibus.
          Curabitur in efficitur mi. Duis risus odio, ullamcorper et blandit eu,
          elementum sed nunc. Aenean neque nibh, maximus quis pulvinar at,
          convallis tincidunt tortor. Quisque in gravida velit. Aenean
          vestibulum sed leo at euismod. Aenean non odio felis. Phasellus in
          urna id ex iaculis vulputate sit amet quis nisi. Donec lacus felis,
          pretium nec convallis at, dictum a quam. Pellentesque vitae diam
          luctus, ultrices dolor a, efficitur quam. Integer posuere nulla felis,
          sed aliquam massa condimentum a. Etiam et laoreet ligula, eu faucibus
          sapien. Curabitur ac sodales leo. Mauris sed risus at felis sagittis
          vulputate quis id nulla. Ut eget viverra nisl. Phasellus tristique a
          dui ac gravida. Mauris pellentesque pellentesque justo, vitae posuere
          diam blandit id. Nunc finibus nunc odio, non dapibus velit vestibulum
          sed. Etiam semper sapien fringilla placerat vestibulum. Praesent
          dignissim leo a nisi blandit, in facilisis quam sagittis. Nam vel
          velit interdum, aliquet nulla fermentum, finibus eros. Etiam blandit
          dui in tincidunt placerat. Nulla dapibus volutpat cursus. Maecenas
          eget varius felis. Vestibulum posuere, odio in rutrum vehicula, neque
          eros maximus felis, et pharetra tellus turpis non erat. Sed ac risus
          non felis condimentum consectetur. Nunc semper nunc ac quam rhoncus
          malesuada. Etiam velit elit, posuere sed leo suscipit, congue aliquet
          metus. Nulla facilisi. Donec imperdiet sit amet tellus ut tincidunt.
          Mauris eget facilisis neque. Duis iaculis justo magna, non hendrerit
          quam auctor egestas. Mauris ornare volutpat lacinia. Nulla vel mi at
          nisi consequat tristique et quis nunc. Vivamus at vehicula ante.
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
          scelerisque diam felis, id vestibulum orci fringilla eget. Cras a erat
          risus. Ut imperdiet orci ante, sed ullamcorper elit scelerisque nec.
          Quisque pellentesque ullamcorper nibh eu blandit. Aliquam fringilla
          sagittis accumsan. Phasellus porta feugiat urna quis accumsan. Donec
          eget nibh tortor. Nam aliquet at libero semper ullamcorper. Nam id
          vestibulum purus, at fermentum orci. Suspendisse at dictum mi, non
          accumsan felis. Curabitur interdum tellus eu turpis consectetur
          tempor. Aenean eget turpis eget magna sollicitudin scelerisque vitae
          nec velit. Nam accumsan, urna sed sodales luctus, nibh sem iaculis
          nibh, vel iaculis erat lorem vel turpis. Duis nec mollis nunc. Integer
          eget dui ac odio tristique maximus et vel odio. Donec condimentum
          pellentesque consectetur. Aliquam ultrices ac velit quis interdum.
          Nunc iaculis diam ac erat mattis, eget dignissim lacus finibus.
          Curabitur in efficitur mi. Duis risus odio, ullamcorper et blandit eu,
          elementum sed nunc. Aenean neque nibh, maximus quis pulvinar at,
          convallis tincidunt tortor. Quisque in gravida velit. Aenean
          vestibulum sed leo at euismod. Aenean non odio felis. Phasellus in
          urna id ex iaculis vulputate sit amet quis nisi. Donec lacus felis,
          pretium nec convallis at, dictum a quam. Pellentesque vitae diam
          luctus, ultrices dolor a, efficitur quam. Integer posuere nulla felis,
          sed aliquam massa condimentum a. Etiam et laoreet ligula, eu faucibus
          sapien. Curabitur ac sodales leo. Mauris sed risus at felis sagittis
          vulputate quis id nulla. Ut eget viverra nisl. Phasellus tristique a
          dui ac gravida. Mauris pellentesque pellentesque justo, vitae posuere
          diam blandit id. Nunc finibus nunc odio, non dapibus velit vestibulum
          sed. Etiam semper sapien fringilla placerat vestibulum. Praesent
          dignissim leo a nisi blandit, in facilisis quam sagittis. Nam vel
          velit interdum, aliquet nulla fermentum, finibus eros. Etiam blandit
          dui in tincidunt placerat. Nulla dapibus volutpat cursus. Maecenas
          eget varius felis. Vestibulum posuere, odio in rutrum vehicula, neque
          eros maximus felis, et pharetra tellus turpis non erat. Sed ac risus
          non felis condimentum consectetur. Nunc semper nunc ac quam rhoncus
          malesuada. Etiam velit elit, posuere sed leo suscipit, congue aliquet
          metus. Nulla facilisi. Donec imperdiet sit amet tellus ut tincidunt.
          Mauris eget facilisis neque. Duis iaculis justo magna, non hendrerit
          quam auctor egestas. Mauris ornare volutpat lacinia. Nulla vel mi at
          nisi consequat tristique et quis nunc. Vivamus at vehicula ante.
        </div> */}
        <div className="flex items-center justify-between my-6">
            <div>
                <h2>
                    Google account: 
                </h2>
            </div>
            <div>
                <h2>
                    harris7001@gmail.com
                </h2>
            </div>
        </div>
        
        <div className="flex items-center justify-between my-6">
            <div>
                <h2>
                    Spotify account: 
                </h2>
            </div>
            <div>
                <h2>
                    harry0446@gmail.com
                </h2>
            </div>
        </div>
        
        <div className="flex items-center justify-between my-6">
            <div>
                <h2>
                    Calendar last updated: 
                </h2>
            </div>
            <div>
                <h2>
                    2 days ago
                </h2>
            </div>
        </div>
        
        <div className="flex items-center justify-between my-6">
            <div>
                <h2>
                    Calendar last updated: 
                </h2>
            </div>
            <div>
                <h2>
                    2 days ago
                </h2>
            </div>
        </div>
      </div>
    </>
  );
}
