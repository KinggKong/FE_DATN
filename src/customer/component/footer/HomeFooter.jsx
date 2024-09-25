export default function HomeFooter() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white mt-10">
      <main className="flex-grow">
        <section
          className="relative h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden"
          style={{
            backgroundImage: `url('/src/assets/images/carousel/carousel_footer2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/placeholder.svg?height=500&width=1000')",
              filter: "brightness(0.4)",
            }}
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              BRINGING YOU TO UPDATE
              <br />
              FANTASTIC FOOTWEAR
            </h1>
            <p className="mb-6 max-w-xl mx-auto text-sm sm:text-base">
              View all brands of our collection on FootWear, there is another
              collection. Please check it out bro, seriously!
            </p>
            <button className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg text-sm sm:text-base">
              More about us
            </button>
          </div>
        </section>
        <footer className="bg-black text-white py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">FootWear</h2>
              <p className="text-sm text-gray-400">
                Footwear was designed and founded in 2023 by person. The theme
                is about sneakers ecommerce that use for shoes selling around
                the world.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Don't Wanna Miss Our Offers?</h3>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Your email@gmail.com"
                    className="bg-gray-700 border-gray-600 p-2 rounded w-full"
                  />
                  <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Shoes</li>
                <li>Apparel</li>
              </ul>
              <h3 className="font-bold mt-6 mb-4">Featured</h3>
              <ul className="space-y-2 text-gray-400">
                <li>New Arrivals</li>
                <li>Sale</li>
                <li>Start Selling</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Collections</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Nike</li>
                <li>Adidas</li>
                <li>Vans</li>
                <li>Aero Street</li>
                <li>Compass</li>
                <li>Ventela</li>
                <li>Bata</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms and Conditions</li>
              </ul>
              <h3 className="font-bold mt-6 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Contact us</li>
                <li>Give feedback</li>
                <li>Help center</li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
