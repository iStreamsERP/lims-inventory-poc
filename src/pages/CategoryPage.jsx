import { Link } from "react-router-dom";

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
		<div className="flex flex-col gap-y-4">
			<h1 className="title text-3xl font-bold">Categories</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((category) => (
					<div
						key={category.name}
						className="relative overflow-hidden h-48 w-full rounded-lg shadow-md group"
					>
						<Link to={`/category/${category.name}`}>
							<div className="w-full h-full cursor-pointer relative">
								<img
									src={category.imageUrl}
									alt={category.name}
									loading="lazy"
									className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
								/>
								<div className="absolute bottom-0 left-0 right-0 px-4 py-2 z-20 bg-gray-300/50 backdrop-blur-sm">
									<h3 className="text-white text-2xl font-bold">{category.name}</h3>
									<p className="text-gray-100 text-sm">Explore {category.name}</p>
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
