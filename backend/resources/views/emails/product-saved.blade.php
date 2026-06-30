<h2>Product {{ $action }}</h2>

<p>A product was {{ $action }} in the catalog.</p>

<ul>
    <li><strong>Name:</strong> {{ $product->name }}</li>
    <li><strong>Price:</strong> {{ $product->price }}</li>
    <li><strong>Category ID:</strong> {{ $product->category_id }}</li>
</ul>
