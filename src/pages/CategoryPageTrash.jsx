import { Link } from "react-router-dom";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "https://m.media-amazon.com/images/I/91E69wClQ4L._AC_UY1100_.jpg" },
	{ href: "/t-shirts", name: "T-Shirts", imageUrl: "https://www.thewalkdeal.com/cdn/shop/products/Never-Give-Up-TheFight.jpg?v=1640673347" },
	{ href: "/shoes", name: "Shoes", imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRTimMYXpPfx9rVSDEY328MRp5WVKxQZ7GXFCdhLNpmFLzOD2btZLTCetsYoCArX4vWi7K4JOcd9VwjgWvDRdG3siXokSF3CYG7eKkGtQBsCJGxwcBCEenV" },
	{ href: "/glasses", name: "Glasses", imageUrl: "https://www.kraywoods.com/cdn/shop/articles/unnamed_4d6159a6-ced6-4169-a9ec-8004ef9873e0.jpg?v=1736879806&width=1100" },
	{ href: "/jackets", name: "Jackets", imageUrl: "https://celio.in/cdn/shop/files/14879883-1055071180377708_1fef0d63-7490-43fc-a1a9-8c1e49187f2e.webp?v=1741757198" },
	{ href: "/suits", name: "Suits", imageUrl: "https://content.moss.co.uk/images/extraextralarge/966945209_02.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "https://accessorizelondon.in/cdn/shop/files/MN-19009003001_1.webp?v=1697531247" },
];

const CategoryPageTrash = () => {
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
								<div className="absolute bottom-0 left-0 right-0 px-4 py-2 z-20 bg-gray-900/50 backdrop-blur-sm">
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

export default CategoryPageTrash;