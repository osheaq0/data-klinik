<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Klinik</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .navbar-brand { font-weight: bold; }
        .table th { background-color: #0d6efd; color: white; }
        .card { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand" href="{{ route('klinik.index') }}">&#x1F3E5; Data Klinik</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link text-white" href="{{ route('klinik.index') }}">Daftar Data</a>
                <a class="nav-link text-white" href="{{ route('klinik.create') }}">Tambah Data</a>
            </div>
        </div>
    </nav>
    <div class="container">
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif
        @yield('content')
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @yield('scripts')
</body>
</html>
