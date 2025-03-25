// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";

// const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];
const categories = [
	{ href: "/jeans", name: "jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "t-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "bags", imageUrl: "/bags.jpg" },
];

const CategoryPage = () => {
	return (
		<div className="p-6">
			<h2 className="text-2xl font-semibold text-blue-300 mb-4">Categories</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((category, index) => (
					<div key={index} className='relative overflow-hidden h-96 w-full rounded-lg group'>
						<Link to={`/category/${category.name}`}>
							<div className='w-full h-full cursor-pointer'>
								<div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
								<img
									src={category.imageUrl}
									alt={category.name}
									className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
									loading='lazy'
								/>
								<div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
									<h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3>
									<p className='text-gray-200 text-sm'>Explore {category.name}</p>
								</div>
							</div>
						</Link>
					</div>

				))}
			</div>
		</div>
	);
};

export default CategoryPage;
